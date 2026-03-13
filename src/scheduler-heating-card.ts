import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "./components/graph-editor";
import "./components/day-selector";
import "./components/room-selector";

import { saveSchedule } from "./services/ha-service";
import {
  CardConfig,
  HomeAssistant,
  ProfileKey,
  Schedule,
  SchedulePoint,
  DEFAULT_PROFILES,
} from "./types";

@customElement("scheduler-heating-card")
export class SchedulerHeatingCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;

  @state() private _config!: CardConfig;
  @state() private _schedule!: Schedule;
  @state() private _activeProfile: ProfileKey = "workday";
  @state() private _activeRoomIdx = 0;
  @state() private _saving = false;
  @state() private _saveError = "";
  @state() private _dirty = false;

  // ---- Lovelace lifecycle ----

  setConfig(config: CardConfig): void {
    if (!config.schedule_id) throw new Error("schedule_id is required");
    if (!config.rooms || config.rooms.length === 0)
      throw new Error("At least one room must be configured");

    this._config = {
      min_value: 5,
      max_value: 30,
      value_step: 0.5,
      unit: "°C",
      profiles: [...DEFAULT_PROFILES],
      ...config,
    };

    // Build initial empty schedule
    this._schedule = this._buildEmptySchedule();
  }

  private _buildEmptySchedule(): Schedule {
    const profiles: Schedule["profiles"] = {};
    for (const p of this._config.profiles ?? DEFAULT_PROFILES) {
      profiles[p] = [];
    }
    return {
      schedule_id: this._config.schedule_id,
      name: this._config.schedule_name ?? this._config.schedule_id,
      rooms: this._config.rooms,
      workday_entity: this._config.workday_entity ?? "",
      profiles,
    };
  }

  // ---- Points for current view (profile + room) ----

  private get _currentPoints(): SchedulePoint[] {
    return this._schedule.profiles[this._activeProfile] ?? [];
  }

  private _setCurrentPoints(pts: SchedulePoint[]): void {
    this._schedule = {
      ...this._schedule,
      profiles: {
        ...this._schedule.profiles,
        [this._activeProfile]: pts,
      },
    };
    this._dirty = true;
  }

  // ---- Event handlers ----

  private _onProfileSelected(e: CustomEvent<ProfileKey>): void {
    this._activeProfile = e.detail;
  }

  private _onRoomSelected(e: CustomEvent<number>): void {
    this._activeRoomIdx = e.detail;
  }

  private _onPointsChanged(e: CustomEvent<SchedulePoint[]>): void {
    this._setCurrentPoints(e.detail);
  }

  private async _onSave(): Promise<void> {
    this._saving = true;
    this._saveError = "";
    try {
      await saveSchedule(this.hass, this._schedule);
      this._dirty = false;
    } catch (err) {
      this._saveError = String(err);
    } finally {
      this._saving = false;
    }
  }

  private _onCopyProfile(): void {
    // Copy current profile points to clipboard as YAML-ish for debugging
    const pts = this._currentPoints;
    if (pts.length === 0) return;
    // Show brief confirmation toast
    this._toast("Profile copied to clipboard");
    navigator.clipboard
      ?.writeText(JSON.stringify(pts, null, 2))
      .catch(() => {/* ignore */});
  }

  private _toastTimer: ReturnType<typeof setTimeout> | null = null;
  @state() private _toastMsg = "";

  private _toast(msg: string): void {
    this._toastMsg = msg;
    if (this._toastTimer) clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      this._toastMsg = "";
    }, 2500);
  }

  // ---- Current room display name ----

  private get _roomLabel(): string {
    const room = this._config.rooms[this._activeRoomIdx];
    if (!room) return "";
    return room.name || room.entity_id.split(".")[1] || room.entity_id;
  }

  // ---- Current entity state ----

  private get _currentEntityState(): string {
    const room = this._config.rooms[this._activeRoomIdx];
    if (!room || !this.hass) return "";
    const entity = this.hass.states[room.entity_id];
    if (!entity) return "unavailable";
    return `${entity.state} ${this._config.unit}`;
  }

  // ---- Workday state ----

  private get _workdayLabel(): string {
    if (!this._config.workday_entity || !this.hass) return "";
    const entity = this.hass.states[this._config.workday_entity];
    if (!entity) return "";
    const isHoliday = entity.attributes["is_holiday"] as boolean | undefined;
    if (isHoliday) return "Holiday";
    return entity.state === "on" ? "Workday" : "Weekend";
  }

  // ---- Render ----

  render() {
    if (!this._config) return html``;

    const profiles = this._config.profiles ?? DEFAULT_PROFILES;

    return html`
      <ha-card>
        <div class="card-header">
          <div class="title">${this._config.title ?? this._schedule.name}</div>
          <div class="meta">
            ${this._workdayLabel
              ? html`<span class="badge badge--day">${this._workdayLabel}</span>`
              : ""}
            ${this._currentEntityState
              ? html`<span class="badge badge--value">${this._roomLabel}: ${this._currentEntityState}</span>`
              : ""}
          </div>
        </div>

        <div class="card-content">
          <!-- Room tabs (only shown if >1 room) -->
          <room-selector
            .rooms="${this._config.rooms}"
            .activeIndex="${this._activeRoomIdx}"
            @room-selected="${this._onRoomSelected}"
          ></room-selector>

          <!-- Day profile tabs -->
          <day-selector
            .profiles="${profiles}"
            .active="${this._activeProfile}"
            @profile-selected="${this._onProfileSelected}"
          ></day-selector>

          <!-- Graph -->
          <graph-editor
            .points="${this._currentPoints}"
            .minValue="${this._config.min_value ?? 5}"
            .maxValue="${this._config.max_value ?? 30}"
            .valueStep="${this._config.value_step ?? 0.5}"
            .unit="${this._config.unit ?? "°C"}"
            @points-changed="${this._onPointsChanged}"
          ></graph-editor>

          <!-- Actions -->
          <div class="actions">
            <button
              class="btn btn--save ${this._saving ? "btn--loading" : ""}"
              ?disabled="${this._saving || !this._dirty}"
              @click="${this._onSave}"
            >
              ${this._saving ? "Saving…" : "Save Schedule"}
            </button>
            <button class="btn btn--copy" @click="${this._onCopyProfile}">
              Copy JSON
            </button>
          </div>

          ${this._saveError
            ? html`<p class="error">${this._saveError}</p>`
            : ""}

          <!-- Point list (mobile-friendly alternative to graph) -->
          ${this._currentPoints.length > 0
            ? html`
                <div class="point-list">
                  <div class="point-list-header">
                    <span>Time</span>
                    <span>Value</span>
                    <span></span>
                  </div>
                  ${[...this._currentPoints]
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((pt, i) =>
                      this._renderPointRow(pt, this._currentPoints.indexOf(pt))
                    )}
                </div>
              `
            : html`<p class="empty-hint">No points yet. Tap the graph to add one.</p>`}
        </div>

        ${this._toastMsg
          ? html`<div class="toast">${this._toastMsg}</div>`
          : ""}
      </ha-card>
    `;
  }

  private _renderPointRow(pt: SchedulePoint, idx: number) {
    return html`
      <div class="point-row">
        <input
          type="time"
          .value="${pt.time}"
          @change="${(e: Event) => {
            const pts = [...this._currentPoints];
            pts[idx] = { ...pts[idx], time: (e.target as HTMLInputElement).value };
            this._setCurrentPoints(pts);
          }}"
        />
        <input
          type="number"
          .value="${String(pt.value)}"
          min="${this._config.min_value ?? 5}"
          max="${this._config.max_value ?? 30}"
          step="${this._config.value_step ?? 0.5}"
          @change="${(e: Event) => {
            const pts = [...this._currentPoints];
            pts[idx] = { ...pts[idx], value: parseFloat((e.target as HTMLInputElement).value) };
            this._setCurrentPoints(pts);
          }}"
        />
        <button
          class="btn-icon btn-icon--delete"
          aria-label="Delete point"
          @click="${() => {
            const pts = [...this._currentPoints];
            pts.splice(idx, 1);
            this._setCurrentPoints(pts);
          }}"
        >✕</button>
      </div>
    `;
  }

  // ---- Card size hint ----
  getCardSize(): number {
    return 6;
  }

  static styles = css`
    :host {
      display: block;
      font-family: var(--primary-font-family, sans-serif);
    }
    ha-card {
      position: relative;
      overflow: hidden;
    }
    .card-header {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 16px 16px 0;
    }
    .title {
      font-size: 18px;
      font-weight: 600;
      color: var(--primary-text-color, #212121);
    }
    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .badge {
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 10px;
      font-weight: 500;
    }
    .badge--day {
      background: var(--primary-color, #03a9f4);
      color: white;
    }
    .badge--value {
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--secondary-text-color, #888);
    }
    .card-content {
      padding: 12px 16px 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* Actions */
    .actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .btn {
      flex: 1;
      min-width: 100px;
      padding: 12px 16px;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      min-height: 44px;
      transition: opacity 0.15s;
    }
    .btn:disabled { opacity: 0.45; cursor: default; }
    .btn--save {
      background: var(--primary-color, #03a9f4);
      color: white;
    }
    .btn--loading { opacity: 0.7; }
    .btn--copy {
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--secondary-text-color, #666);
    }

    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
      margin: 0;
    }

    /* Point list */
    .point-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .point-list-header {
      display: grid;
      grid-template-columns: 1fr 1fr 40px;
      gap: 8px;
      font-size: 11px;
      color: var(--secondary-text-color, #888);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 0 4px;
    }
    .point-row {
      display: grid;
      grid-template-columns: 1fr 1fr 40px;
      gap: 8px;
      align-items: center;
    }
    .point-row input {
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 8px;
      padding: 8px 10px;
      font-size: 15px;
      min-height: 44px;
      background: var(--input-fill-color, #f5f5f5);
      color: var(--primary-text-color, #212121);
      width: 100%;
      box-sizing: border-box;
    }
    .btn-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 44px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
    }
    .btn-icon--delete {
      background: transparent;
      color: var(--error-color, #f44336);
    }
    .btn-icon--delete:hover { background: rgba(244,67,54,0.08); }

    .empty-hint {
      font-size: 13px;
      color: var(--secondary-text-color, #aaa);
      text-align: center;
      margin: 8px 0;
    }

    /* Toast */
    .toast {
      position: absolute;
      bottom: 12px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.75);
      color: white;
      border-radius: 20px;
      padding: 8px 18px;
      font-size: 13px;
      pointer-events: none;
      white-space: nowrap;
    }
  `;
}

// ---- Editor for the Lovelace UI editor ----

@customElement("scheduler-heating-card-editor")
export class SchedulerHeatingCardEditor extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private _config: Partial<CardConfig> = {};

  setConfig(config: CardConfig): void {
    this._config = config;
  }

  private _valueChanged(e: CustomEvent): void {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: { ...this._config, ...(e.detail?.value ?? {}) } },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="editor">
        <p style="font-size:13px;color:var(--secondary-text-color,#888)">
          Configure via YAML. Required: <code>schedule_id</code>, <code>rooms</code>.
        </p>
      </div>
    `;
  }

  static styles = css`
    :host { display: block; padding: 8px; }
    code { background: var(--code-editor-background-color,#f5f5f5); padding: 2px 4px; border-radius: 4px; }
  `;
}

// ---- HACS / Lovelace registration ----

(window as unknown as Record<string, unknown>)["customCards"] =
  (window as unknown as Record<string, unknown[]>)["customCards"] ?? [];
((window as unknown as Record<string, unknown[]>)["customCards"]).push({
  type: "scheduler-heating-card",
  name: "Scheduler Heating Card",
  description: "Mobile-friendly heating schedule with interactive graph",
  preview: false,
  documentationURL: "https://github.com/xcojonny/hassio-scheduler-heating-card",
});
