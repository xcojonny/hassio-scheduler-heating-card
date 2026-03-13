import { HomeAssistant, Schedule } from "../types";

const DOMAIN = "heating_scheduler";

/** Persist a schedule to the backend custom component. */
export async function saveSchedule(hass: HomeAssistant, schedule: Schedule): Promise<void> {
  await hass.callService(DOMAIN, "save_schedule", {
    schedule_id: schedule.schedule_id,
    name: schedule.name,
    rooms: schedule.rooms,
    workday_entity: schedule.workday_entity,
    profiles: schedule.profiles,
  });
}

/** Delete a schedule from the backend. */
export async function deleteSchedule(hass: HomeAssistant, scheduleId: string): Promise<void> {
  await hass.callService(DOMAIN, "delete_schedule", { schedule_id: scheduleId });
}

/** Request all schedules — backend fires `heating_scheduler_schedules_response`. */
export async function requestSchedules(hass: HomeAssistant): Promise<void> {
  await hass.callService(DOMAIN, "get_schedules", {});
}
