import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { RoomConfig } from "../types";

@customElement("room-selector")
export class RoomSelector extends LitElement {
  @property({ type: Array }) rooms: RoomConfig[] = [];
  @property({ type: Number }) activeIndex = 0;

  private _select(idx: number): void {
    this.dispatchEvent(
      new CustomEvent<number>("room-selected", {
        detail: idx,
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    if (this.rooms.length <= 1) return html``;
    return html`
      <div class="rooms" role="tablist">
        ${this.rooms.map(
          (room, i) => html`
            <button
              role="tab"
              aria-selected="${this.activeIndex === i}"
              class="room-tab ${this.activeIndex === i ? "room-tab--active" : ""}"
              @click="${() => this._select(i)}"
            >
              ${room.name || room.entity_id.split(".")[1] || room.entity_id}
            </button>
          `
        )}
      </div>
    `;
  }

  static styles = css`
    :host { display: block; }
    .rooms {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      padding: 4px 0 8px;
    }
    .room-tab {
      padding: 8px 14px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 20px;
      background: var(--secondary-background-color, #f5f5f5);
      color: var(--secondary-text-color, #666);
      font-size: 13px;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
      min-height: 36px;
    }
    .room-tab--active {
      background: var(--accent-color, #ff9800);
      color: white;
      border-color: var(--accent-color, #ff9800);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "room-selector": RoomSelector;
  }
}
