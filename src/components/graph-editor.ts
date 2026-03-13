import { LitElement, html, css, svg, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { SchedulePoint } from "../types";

const PAD = { top: 20, right: 20, bottom: 40, left: 48 };
const MIN_TIME = 0;    // minutes from midnight
const MAX_TIME = 1440; // 24 * 60
const SNAP_MINUTES = 15;

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(m: number): string {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

function snap(val: number, step: number): number {
  return Math.round(val / step) * step;
}

@customElement("graph-editor")
export class GraphEditor extends LitElement {
  @property({ type: Array }) points: SchedulePoint[] = [];
  @property({ type: Number }) minValue = 5;
  @property({ type: Number }) maxValue = 30;
  @property({ type: Number }) valueStep = 0.5;
  @property({ type: String }) unit = "°C";

  @state() private _width = 600;
  @state() private _height = 300;
  @state() private _dragging: number | null = null;
  @state() private _hovering: number | null = null;
  @state() private _editingIdx: number | null = null;

  private _svgRef: SVGSVGElement | null = null;
  private _resizeObserver: ResizeObserver | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this._resizeObserver = new ResizeObserver(() => this._measureSize());
    this._resizeObserver.observe(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._resizeObserver?.disconnect();
  }

  private _measureSize(): void {
    const w = this.offsetWidth || 600;
    this._width = w;
    this._height = Math.max(200, Math.min(320, w * 0.45));
  }

  // --- coordinate helpers ---

  private get _iw(): number { return this._width - PAD.left - PAD.right; }
  private get _ih(): number { return this._height - PAD.top - PAD.bottom; }

  private _xToMinutes(px: number): number {
    return snap(MIN_TIME + (px / this._iw) * MAX_TIME, SNAP_MINUTES);
  }

  private _minutesToX(minutes: number): number {
    return ((minutes - MIN_TIME) / MAX_TIME) * this._iw;
  }

  private _yToValue(py: number): number {
    const raw = this.maxValue - (py / this._ih) * (this.maxValue - this.minValue);
    return snap(raw, this.valueStep);
  }

  private _valueToY(value: number): number {
    return ((this.maxValue - value) / (this.maxValue - this.minValue)) * this._ih;
  }

  // --- event → SVG coordinates ---

  private _eventToSVGPoint(e: PointerEvent | TouchEvent): { x: number; y: number } | null {
    if (!this._svgRef) return null;
    const rect = this._svgRef.getBoundingClientRect();
    let cx: number, cy: number;
    if (e instanceof TouchEvent) {
      const t = e.touches[0] ?? e.changedTouches[0];
      if (!t) return null;
      cx = t.clientX; cy = t.clientY;
    } else {
      cx = e.clientX; cy = e.clientY;
    }
    return {
      x: cx - rect.left - PAD.left,
      y: cy - rect.top - PAD.top,
    };
  }

  // --- sorted points helper ---

  private _sorted(): SchedulePoint[] {
    return [...this.points].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
  }

  // --- emit change ---

  private _emit(): void {
    this.dispatchEvent(
      new CustomEvent<SchedulePoint[]>("points-changed", {
        detail: [...this.points],
        bubbles: true,
        composed: true,
      })
    );
  }

  // --- add dot on canvas click ---

  private _onCanvasPointerDown(e: PointerEvent): void {
    if (this._dragging !== null) return;
    const pt = this._eventToSVGPoint(e);
    if (!pt) return;
    if (pt.x < 0 || pt.x > this._iw || pt.y < 0 || pt.y > this._ih) return;

    const minutes = this._xToMinutes(pt.x);
    const value = Math.max(this.minValue, Math.min(this.maxValue, this._yToValue(pt.y)));
    const time = minutesToTime(minutes);

    // If a point already exists at this time, don't add
    if (this.points.some((p) => p.time === time)) return;

    this.points = [...this.points, { time, value }];
    this._emit();
  }

  // --- drag dot ---

  private _onDotPointerDown(e: PointerEvent, idx: number): void {
    e.stopPropagation();
    e.preventDefault();
    this._dragging = idx;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  }

  private _onDotPointerMove(e: PointerEvent, idx: number): void {
    if (this._dragging !== idx) return;
    const pt = this._eventToSVGPoint(e);
    if (!pt) return;

    const minutes = Math.max(MIN_TIME, Math.min(MAX_TIME - SNAP_MINUTES, this._xToMinutes(pt.x)));
    const value = Math.max(this.minValue, Math.min(this.maxValue, this._yToValue(Math.max(0, Math.min(this._ih, pt.y)))));
    const time = minutesToTime(minutes);

    const updated = [...this.points];
    updated[idx] = { time, value };
    this.points = updated;
    this._emit();
  }

  private _onDotPointerUp(e: PointerEvent, idx: number): void {
    if (this._dragging === idx) {
      this._dragging = null;
    }
  }

  // --- double-tap / double-click to edit ---

  private _tapTimers: Map<number, ReturnType<typeof setTimeout>> = new Map();

  private _onDotClick(e: PointerEvent, idx: number): void {
    e.stopPropagation();
    if (this._tapTimers.has(idx)) {
      clearTimeout(this._tapTimers.get(idx)!);
      this._tapTimers.delete(idx);
      // double tap — open editor
      this._editingIdx = idx;
    } else {
      const timer = setTimeout(() => {
        this._tapTimers.delete(idx);
      }, 300);
      this._tapTimers.set(idx, timer);
    }
  }

  private _deleteDot(idx: number): void {
    const updated = [...this.points];
    updated.splice(idx, 1);
    this.points = updated;
    this._editingIdx = null;
    this._emit();
  }

  private _updateDotFromEditor(idx: number, field: "time" | "value", raw: string): void {
    const updated = [...this.points];
    if (field === "time") {
      updated[idx] = { ...updated[idx], time: raw };
    } else {
      const v = Math.max(this.minValue, Math.min(this.maxValue, parseFloat(raw)));
      updated[idx] = { ...updated[idx], value: isNaN(v) ? updated[idx].value : v };
    }
    this.points = updated;
    this._emit();
  }

  // --- render ---

  private _renderGrid() {
    const lines: unknown[] = [];
    // Horizontal grid lines every 5 degrees
    const step = this.valueStep <= 0.5 ? 5 : this.valueStep * 2;
    for (let v = this.minValue; v <= this.maxValue; v += step) {
      const y = this._valueToY(v);
      lines.push(svg`
        <line x1="0" y1="${y}" x2="${this._iw}" y2="${y}" class="grid-line" />
        <text x="-6" y="${y + 4}" class="axis-label" text-anchor="end">${v}</text>
      `);
    }
    // Vertical grid lines every 2 hours
    for (let h = 0; h <= 24; h += 2) {
      const x = this._minutesToX(h * 60);
      lines.push(svg`
        <line x1="${x}" y1="0" x2="${x}" y2="${this._ih}" class="grid-line" />
        <text x="${x}" y="${this._ih + 18}" class="axis-label" text-anchor="middle">${String(h).padStart(2, "0")}:00</text>
      `);
    }
    return lines;
  }

  private _renderStepLine(sorted: SchedulePoint[]) {
    if (sorted.length === 0) return svg``;
    let d = "";
    sorted.forEach((pt, i) => {
      const x = this._minutesToX(timeToMinutes(pt.time));
      const y = this._valueToY(pt.value);
      if (i === 0) {
        d += `M 0 ${y} H ${x}`;
      } else {
        const prevY = this._valueToY(sorted[i - 1].value);
        d += ` V ${prevY} H ${x}`;
      }
    });
    // extend to end of day
    const lastY = this._valueToY(sorted[sorted.length - 1].value);
    d += ` V ${lastY} H ${this._iw}`;

    return svg`<path d="${d}" class="step-line" />`;
  }

  private _renderDots(sorted: SchedulePoint[]) {
    return sorted.map((pt, i) => {
      const x = this._minutesToX(timeToMinutes(pt.time));
      const y = this._valueToY(pt.value);
      const originalIdx = this.points.indexOf(pt);
      const isHover = this._hovering === originalIdx;
      const isDrag = this._dragging === originalIdx;
      return svg`
        <g class="dot-group"
          @pointerdown="${(e: PointerEvent) => this._onDotPointerDown(e, originalIdx)}"
          @pointermove="${(e: PointerEvent) => this._onDotPointerMove(e, originalIdx)}"
          @pointerup="${(e: PointerEvent) => this._onDotPointerUp(e, originalIdx)}"
          @click="${(e: PointerEvent) => this._onDotClick(e, originalIdx)}"
          @pointerenter="${() => (this._hovering = originalIdx)}"
          @pointerleave="${() => (this._hovering = null)}"
        >
          <circle cx="${x}" cy="${y}" r="${isDrag ? 14 : isHover ? 12 : 10}"
            class="dot ${isDrag ? "dot--drag" : ""}" />
          <text x="${x}" y="${y - 15}" class="dot-label" text-anchor="middle">
            ${pt.time} ${pt.value}${this.unit}
          </text>
        </g>
      `;
    });
  }

  private _renderEditPopover(idx: number) {
    const pt = this.points[idx];
    if (!pt) return html``;
    const x = PAD.left + this._minutesToX(timeToMinutes(pt.time));
    const y = PAD.top + this._valueToY(pt.value);
    // position popover, flip if too close to edge
    const left = Math.min(x, this._width - 200);
    const top = y < 100 ? y + 20 : y - 110;

    return html`
      <div class="popover" style="left:${left}px;top:${top}px">
        <div class="popover-row">
          <label>Time</label>
          <input type="time" .value="${pt.time}"
            @change="${(e: Event) => this._updateDotFromEditor(idx, "time", (e.target as HTMLInputElement).value)}" />
        </div>
        <div class="popover-row">
          <label>Value</label>
          <input type="number" .value="${String(pt.value)}"
            min="${this.minValue}" max="${this.maxValue}" step="${this.valueStep}"
            @change="${(e: Event) => this._updateDotFromEditor(idx, "value", (e.target as HTMLInputElement).value)}" />
        </div>
        <div class="popover-actions">
          <button class="btn-delete" @click="${() => this._deleteDot(idx)}">Delete</button>
          <button class="btn-close" @click="${() => (this._editingIdx = null)}">Done</button>
        </div>
      </div>
    `;
  }

  protected firstUpdated(_changed: PropertyValues): void {
    this._svgRef = this.shadowRoot?.querySelector("svg") ?? null;
    this._measureSize();
  }

  render() {
    const sorted = this._sorted();
    return html`
      <div class="container">
        <svg
          width="${this._width}"
          height="${this._height}"
          @pointerdown="${this._onCanvasPointerDown}"
          style="touch-action:none;cursor:crosshair"
        >
          <g transform="translate(${PAD.left},${PAD.top})">
            ${this._renderGrid()}
            ${this._renderStepLine(sorted)}
            ${this._renderDots(sorted)}
          </g>
          <!-- Unit label -->
          <text x="10" y="${this._height / 2}" class="axis-unit"
            transform="rotate(-90,10,${this._height / 2})">${this.unit}</text>
        </svg>
        ${this._editingIdx !== null ? this._renderEditPopover(this._editingIdx) : ""}
        <p class="hint">Tap to add a point • Drag to move • Double-tap to edit/delete</p>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      position: relative;
      font-family: var(--primary-font-family, sans-serif);
    }
    .container {
      position: relative;
      user-select: none;
      -webkit-user-select: none;
    }
    svg { display: block; overflow: visible; }

    .grid-line { stroke: var(--divider-color, #e0e0e0); stroke-width: 1; }
    .axis-label { font-size: 11px; fill: var(--secondary-text-color, #888); }
    .axis-unit {
      font-size: 11px;
      fill: var(--secondary-text-color, #888);
      text-anchor: middle;
    }

    .step-line {
      fill: none;
      stroke: var(--primary-color, #03a9f4);
      stroke-width: 2.5;
      stroke-linejoin: round;
    }

    .dot {
      fill: var(--primary-color, #03a9f4);
      stroke: white;
      stroke-width: 2.5;
      cursor: grab;
      transition: r 0.1s;
    }
    .dot--drag { cursor: grabbing; }

    .dot-label {
      font-size: 11px;
      fill: var(--primary-text-color, #212121);
      pointer-events: none;
      paint-order: stroke;
      stroke: white;
      stroke-width: 3px;
    }

    .popover {
      position: absolute;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 12px;
      padding: 12px 14px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.18);
      z-index: 10;
      min-width: 180px;
    }
    .popover-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    .popover-row label {
      font-size: 13px;
      color: var(--secondary-text-color, #888);
      min-width: 44px;
    }
    .popover-row input {
      flex: 1;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 8px;
      padding: 6px 8px;
      font-size: 15px;
      min-height: 36px;
      background: var(--input-fill-color, #f5f5f5);
      color: var(--primary-text-color, #212121);
      width: 100%;
      box-sizing: border-box;
    }
    .popover-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      margin-top: 4px;
    }
    .btn-delete {
      background: var(--error-color, #f44336);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 8px 14px;
      font-size: 14px;
      cursor: pointer;
      min-height: 36px;
    }
    .btn-close {
      background: var(--primary-color, #03a9f4);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 8px 14px;
      font-size: 14px;
      cursor: pointer;
      min-height: 36px;
    }
    .hint {
      font-size: 11px;
      color: var(--secondary-text-color, #aaa);
      text-align: center;
      margin: 4px 0 0;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "graph-editor": GraphEditor;
  }
}
