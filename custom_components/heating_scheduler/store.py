"""Persistent storage for Heating Scheduler schedules."""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import STORAGE_KEY, STORAGE_VERSION

_LOGGER = logging.getLogger(__name__)


class ScheduleStore:
    """Manages persistent schedule storage using HA's built-in Store."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self._data: dict[str, Any] = {}

    async def async_load(self) -> None:
        """Load schedules from persistent storage."""
        stored = await self._store.async_load()
        if stored:
            self._data = stored
        else:
            self._data = {"schedules": {}}
        _LOGGER.debug("Loaded %d schedules", len(self._data.get("schedules", {})))

    def get_all(self) -> dict[str, Any]:
        """Return all schedules keyed by schedule id."""
        return dict(self._data.get("schedules", {}))

    def get(self, schedule_id: str) -> dict[str, Any] | None:
        """Return a single schedule by id."""
        return self._data.get("schedules", {}).get(schedule_id)

    async def async_save_schedule(self, schedule_id: str, schedule: dict[str, Any]) -> None:
        """Persist a schedule."""
        if "schedules" not in self._data:
            self._data["schedules"] = {}
        self._data["schedules"][schedule_id] = schedule
        await self._store.async_save(self._data)
        _LOGGER.debug("Saved schedule %s", schedule_id)

    async def async_delete_schedule(self, schedule_id: str) -> bool:
        """Delete a schedule. Returns True if it existed."""
        schedules = self._data.get("schedules", {})
        if schedule_id in schedules:
            del schedules[schedule_id]
            await self._store.async_save(self._data)
            _LOGGER.debug("Deleted schedule %s", schedule_id)
            return True
        return False
