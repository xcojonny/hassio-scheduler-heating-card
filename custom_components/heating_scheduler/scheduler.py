"""Core scheduler logic — applies setpoints at the right time."""
from __future__ import annotations

import logging
from datetime import datetime, time
from typing import Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.event import async_track_time_change, async_track_state_change_event
from homeassistant.util import dt as dt_util

from .const import (
    DOMAIN,
    PROFILE_WORKDAY,
    PROFILE_WEEKEND,
    PROFILE_HOLIDAY,
    WEEKDAYS,
)
from .store import ScheduleStore

_LOGGER = logging.getLogger(__name__)

WEEKDAY_MAP = {
    0: "monday",
    1: "tuesday",
    2: "wednesday",
    3: "thursday",
    4: "friday",
    5: "saturday",
    6: "sunday",
}


class HeatingScheduler:
    """Applies heating schedules by tracking time and workday state."""

    def __init__(self, hass: HomeAssistant, store: ScheduleStore) -> None:
        self.hass = hass
        self.store = store
        self._unsub_time: list[Any] = []
        self._unsub_state: list[Any] = []

    async def async_start(self) -> None:
        """Start listening to time and workday changes."""
        # Fire every minute to check if any setpoint needs applying
        self._unsub_time.append(
            async_track_time_change(
                self.hass,
                self._async_time_fired,
                second=0,
            )
        )
        # Re-evaluate immediately when workday sensor changes
        self._unsub_state.append(
            async_track_state_change_event(
                self.hass,
                [],  # We'll match dynamically in the callback
                self._async_state_changed,
            )
        )
        _LOGGER.info("Heating Scheduler started")

    async def async_stop(self) -> None:
        """Stop all listeners."""
        for unsub in self._unsub_time + self._unsub_state:
            unsub()
        self._unsub_time.clear()
        self._unsub_state.clear()

    @callback
    def _async_state_changed(self, event: Any) -> None:
        """Called when any tracked entity state changes."""
        entity_id: str = event.data.get("entity_id", "")
        # Only act on workday sensor changes
        schedules = self.store.get_all()
        for schedule in schedules.values():
            if schedule.get("workday_entity") == entity_id:
                self.hass.async_create_task(self._async_apply_all_current())
                return

    @callback
    def _async_time_fired(self, now: datetime) -> None:
        """Called every minute — check every schedule."""
        self.hass.async_create_task(self._async_apply_at_time(now))

    async def _async_apply_all_current(self) -> None:
        """Re-apply the current time block for all schedules (workday change)."""
        now = dt_util.now()
        await self._async_apply_at_time(now)

    async def _async_apply_at_time(self, now: datetime) -> None:
        """Apply the matching setpoint for every schedule at the given time."""
        schedules = self.store.get_all()
        for schedule_id, schedule in schedules.items():
            try:
                await self._async_apply_schedule(schedule_id, schedule, now)
            except Exception:
                _LOGGER.exception("Error applying schedule %s", schedule_id)

    async def _async_apply_schedule(
        self, schedule_id: str, schedule: dict[str, Any], now: datetime
    ) -> None:
        """Determine the active profile and apply the setpoint if we're at a block boundary."""
        profile_key = self._get_active_profile(schedule, now)
        profile: list[dict[str, Any]] = schedule.get("profiles", {}).get(profile_key, [])

        if not profile:
            return

        current_time = now.time().replace(second=0, microsecond=0)

        # Find a point whose time matches exactly (minute granularity)
        for point in profile:
            point_time = _parse_time(point.get("time", ""))
            if point_time and point_time == current_time:
                value = float(point["value"])
                for room in schedule.get("rooms", []):
                    entity_id: str = room.get("entity_id", "")
                    if entity_id:
                        await self._async_set_number(entity_id, value)
                _LOGGER.debug(
                    "Schedule %s applied value %.1f at %s (profile=%s)",
                    schedule_id, value, current_time, profile_key,
                )
                return

    def _get_active_profile(self, schedule: dict[str, Any], now: datetime) -> str:
        """Determine which profile to use based on workday sensor and weekday."""
        weekday_name = WEEKDAY_MAP[now.weekday()]

        # Per-weekday override takes highest priority
        if weekday_name in schedule.get("profiles", {}):
            return weekday_name

        # Check workday sensor
        workday_entity: str = schedule.get("workday_entity", "")
        if workday_entity:
            state = self.hass.states.get(workday_entity)
            if state:
                if state.attributes.get("is_holiday", False):
                    return PROFILE_HOLIDAY
                if state.state == "on":
                    return PROFILE_WORKDAY
                return PROFILE_WEEKEND

        # Fallback: Mon–Fri = workday, Sat–Sun = weekend
        if now.weekday() < 5:
            return PROFILE_WORKDAY
        return PROFILE_WEEKEND

    async def _async_set_number(self, entity_id: str, value: float) -> None:
        """Call number.set_value service."""
        state = self.hass.states.get(entity_id)
        if state is None:
            _LOGGER.warning("Entity %s not found, skipping", entity_id)
            return

        domain = entity_id.split(".")[0]
        if domain == "number":
            service = "set_value"
        elif domain == "input_number":
            service = "set_value"
        else:
            _LOGGER.warning("Unsupported entity domain: %s", domain)
            return

        await self.hass.services.async_call(
            domain,
            service,
            {"entity_id": entity_id, "value": value},
            blocking=False,
        )
        _LOGGER.debug("Set %s = %.1f", entity_id, value)


def _parse_time(time_str: str) -> time | None:
    """Parse HH:MM string into a time object."""
    try:
        parts = time_str.split(":")
        return time(int(parts[0]), int(parts[1]))
    except (ValueError, IndexError, AttributeError):
        return None
