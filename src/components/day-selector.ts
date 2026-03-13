import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ProfileKey, PROFILE_LABELS, DEFAULT_PROFILES } from "../types";

@customElement("day-selector")
export class DaySelector extends LitElement {
  @property({ type: Array }) profiles: ProfileKey[] = [...DEFAULT_PROFILES];
  @property({ type: String }) active: ProfileKey = "workday";

  private _select(key: ProfileKey): void {
    this.dispatchEvent(
      new CustomEvent<ProfileKey>("profile-selected", {
        detail: key,
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="tabs" role="tablist">
        ${this.profiles.map(
          (key) => html`
            <button
              role="tab"
              aria-selected="${this.active === key}"
              class="tab ${this.active === key ? "tab--active" : ""}"
              @click="${() => this._select(key)}"
            >
              ${PROFILE_LABELS[key] ?? key}
            </button>
          `
        )}
      </div>
    `;
  }

  static styles = css`
    :host { display: block; }
    .tabs {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      padding: 4px 0;
    }
    .tab {
      flex: 1;
      min-width: 72px;
      padding: 10px 6px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 10px;
      background: var(--secondary-background-color, #f5f5f5);
      color: var(--secondary-text-color, #666);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
      min-height: 44px;
    }
    .tab--active {
      background: var(--primary-color, #03a9f4);
      color: white;
      border-color: var(--primary-color, #03a9f4);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "day-selector": DaySelector;
  }
}
