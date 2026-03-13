# Scheduler Heating Card

A mobile-friendly HACS Lovelace card for scheduling `number` / `input_number` entities (e.g. heating setpoints).

## Features

- Interactive SVG graph (x = time, y = temperature / any value)
- Add dots by tapping the graph; drag to adjust; double-tap to edit or delete
- Mobile-first: large touch targets, popover editors, pinch-friendly layout
- Per-profile schedules: **Workday**, **Weekend**, **Holiday** (uses your existing `binary_sensor.workday_sensor`)
- Optional per-weekday overrides (Monday … Sunday)
- Multi-room: one card manages multiple `number` entities
- Schedule runs **server-side** via a companion `custom_component` — works even when the dashboard is closed

---

## Installation

### 1. HACS

1. In HACS → **Frontend** → **+ Explore & download repositories**
2. Search for **Scheduler Heating Card**
3. Download and restart HA

*Or add this repo manually as a custom repository (type: Lovelace).*

### 2. Custom Component (backend scheduler)

Copy the `custom_components/heating_scheduler/` folder into your HA `config/custom_components/` directory, then restart HA.

Add to `configuration.yaml`:

```yaml
heating_scheduler:
```

---

## Card Configuration

```yaml
type: custom:scheduler-heating-card
schedule_id: living_room          # unique ID — used as storage key
schedule_name: Living Room        # display name (optional)
workday_entity: binary_sensor.workday_sensor
min_value: 16                     # Y-axis min (default 5)
max_value: 24                     # Y-axis max (default 30)
value_step: 0.5                   # snap step (default 0.5)
unit: "°C"                        # Y-axis label (default °C)
profiles:                         # tabs to show (default: workday/weekend/holiday)
  - workday
  - weekend
  - holiday
rooms:
  - entity_id: number.living_room_temperature_setpoint
    name: Living Room
  - entity_id: number.office_temperature_setpoint
    name: Office
```

### Multiple rooms, one card

Add as many entries under `rooms` as you like. The card shows a pill-shaped room selector when there is more than one room. Each room shares the same time-profile (all rooms in the schedule receive the same setpoint at each time block).

### Multiple cards, multiple schedules

Add separate cards with different `schedule_id` values. Each card is completely independent.

---

## How the Schedule Runs

1. The card calls `heating_scheduler.save_schedule` whenever you press **Save Schedule**.
2. The `heating_scheduler` custom component listens to minute-tick events from HA's event bus.
3. At each saved time point, it calls `number.set_value` (or `input_number.set_value`) for every room in the schedule.
4. The active profile is chosen automatically:
   - If a per-weekday override exists for today → use it
   - Else if `workday_entity` is `on` → `workday` profile
   - Else if `workday_entity` reports `is_holiday=true` → `holiday` profile
   - Else → `weekend` profile

---

## Services (advanced)

| Service | Description |
|---|---|
| `heating_scheduler.save_schedule` | Create/update a schedule |
| `heating_scheduler.delete_schedule` | Remove a schedule |
| `heating_scheduler.get_schedules` | Fire event with all schedules |

---

## Development

```bash
npm install
npm run build          # produces dist/scheduler-heating-card.js
npm run watch          # watch mode
```