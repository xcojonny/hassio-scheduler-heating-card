"""Heating Scheduler — server-side schedule runner for number/input_number entities."""
from __future__ import annotations

import logging
import voluptuous as vol

from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

from .const import (
    DOMAIN,
    SERVICE_SAVE_SCHEDULE,
    SERVICE_DELETE_SCHEDULE,
    SERVICE_GET_SCHEDULES,
    EVENT_SCHEDULE_UPDATED,
    VALID_PROFILES,
    WEEKDAYS,
)
from .store import ScheduleStore
from .scheduler import HeatingScheduler

_LOGGER = logging.getLogger(__name__)

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

# ----- Service schemas -----

ROOM_SCHEMA = vol.Schema(
    {
        vol.Required("entity_id"): cv.entity_id,
        vol.Optional("name", default=""): str,
    }
)

POINT_SCHEMA = vol.Schema(
    {
        vol.Required("time"): str,   # "HH:MM"
        vol.Required("value"): vol.Coerce(float),
    }
)

SAVE_SCHEDULE_SCHEMA = vol.Schema(
    {
        vol.Required("schedule_id"): str,
        vol.Optional("name", default=""): str,
        vol.Required("rooms"): vol.All(cv.ensure_list, [ROOM_SCHEMA]),
        vol.Optional("workday_entity", default=""): str,
        # profiles: dict of profile_key -> list of {time, value} points
        vol.Required("profiles"): dict,
    },
    extra=vol.ALLOW_EXTRA,
)

DELETE_SCHEDULE_SCHEMA = vol.Schema(
    {
        vol.Required("schedule_id"): str,
    }
)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the Heating Scheduler component."""
    store = ScheduleStore(hass)
    await store.async_load()

    scheduler = HeatingScheduler(hass, store)
    await scheduler.async_start()

    hass.data[DOMAIN] = {
        "store": store,
        "scheduler": scheduler,
    }

    # ----- Services -----

    async def handle_save_schedule(call: ServiceCall) -> None:
        schedule_id: str = call.data["schedule_id"]
        schedule = dict(call.data)
        await store.async_save_schedule(schedule_id, schedule)
        hass.bus.async_fire(EVENT_SCHEDULE_UPDATED, {"schedule_id": schedule_id, "action": "saved"})
        _LOGGER.info("Schedule %s saved via service", schedule_id)

    async def handle_delete_schedule(call: ServiceCall) -> None:
        schedule_id: str = call.data["schedule_id"]
        deleted = await store.async_delete_schedule(schedule_id)
        if deleted:
            hass.bus.async_fire(
                EVENT_SCHEDULE_UPDATED, {"schedule_id": schedule_id, "action": "deleted"}
            )
            _LOGGER.info("Schedule %s deleted", schedule_id)
        else:
            _LOGGER.warning("Schedule %s not found for deletion", schedule_id)

    async def handle_get_schedules(call: ServiceCall) -> None:
        """Fire an event with all schedules so the card can read them."""
        schedules = store.get_all()
        hass.bus.async_fire(
            f"{DOMAIN}_schedules_response",
            {"schedules": schedules},
        )

    hass.services.async_register(
        DOMAIN, SERVICE_SAVE_SCHEDULE, handle_save_schedule, schema=SAVE_SCHEDULE_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_DELETE_SCHEDULE, handle_delete_schedule, schema=DELETE_SCHEDULE_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_GET_SCHEDULES, handle_get_schedules
    )

    _LOGGER.info("Heating Scheduler integration loaded")
    return True
