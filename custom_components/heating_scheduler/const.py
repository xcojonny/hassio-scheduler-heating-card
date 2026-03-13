"""Constants for the Heating Scheduler integration."""

DOMAIN = "heating_scheduler"
STORAGE_KEY = "heating_scheduler.schedules"
STORAGE_VERSION = 1

SERVICE_SAVE_SCHEDULE = "save_schedule"
SERVICE_DELETE_SCHEDULE = "delete_schedule"
SERVICE_GET_SCHEDULES = "get_schedules"

# Day profile keys
PROFILE_WORKDAY = "workday"
PROFILE_WEEKEND = "weekend"
PROFILE_HOLIDAY = "holiday"

VALID_PROFILES = [PROFILE_WORKDAY, PROFILE_WEEKEND, PROFILE_HOLIDAY]

# Weekday names used as optional per-day overrides
WEEKDAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

EVENT_SCHEDULE_UPDATED = f"{DOMAIN}_schedule_updated"
