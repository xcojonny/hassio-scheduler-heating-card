/** A single time-value point on the graph. */
export interface SchedulePoint {
  time: string;   // "HH:MM"
  value: number;
}

/** A room entry: one number entity with an optional display name. */
export interface RoomConfig {
  entity_id: string;
  name?: string;
}

/** Profile types supported by the backend. */
export type ProfileKey =
  | "workday"
  | "weekend"
  | "holiday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export const PROFILE_LABELS: Record<ProfileKey, string> = {
  workday: "Workday",
  weekend: "Weekend",
  holiday: "Holiday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export const DEFAULT_PROFILES: ProfileKey[] = ["workday", "weekend", "holiday"];

/** One complete schedule (maps to backend Schedule storage). */
export interface Schedule {
  schedule_id: string;
  name: string;
  rooms: RoomConfig[];
  workday_entity: string;
  profiles: Partial<Record<ProfileKey, SchedulePoint[]>>;
}

/** Card-level configuration written in Lovelace YAML. */
export interface CardConfig {
  /** Title shown in the card header. */
  title?: string;
  /** Which schedule ID this card manages. Auto-created if missing. */
  schedule_id: string;
  /** Human-readable name for this schedule. */
  schedule_name?: string;
  /** Rooms managed by this card. */
  rooms: RoomConfig[];
  /** Workday binary sensor entity. */
  workday_entity?: string;
  /** Which profiles to show tabs for (default: workday/weekend/holiday). */
  profiles?: ProfileKey[];
  /** Min value on the Y axis (default: 5). */
  min_value?: number;
  /** Max value on the Y axis (default: 30). */
  max_value?: number;
  /** Step for the value snap (default: 0.5). */
  value_step?: number;
  /** Unit label shown on Y axis (default: °C). */
  unit?: string;
}

/** Minimal HA types so we don't need the full @types/home-assistant-js-websocket. */
export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  callService(domain: string, service: string, data?: Record<string, unknown>): Promise<void>;
  connection: {
    subscribeEvents(callback: (event: unknown) => void, eventType: string): Promise<() => void>;
  };
}
