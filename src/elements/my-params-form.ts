import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { State } from '@heymp/signals';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-params-form')
export class MyParamsForm extends LitElement {
  formData = new State(new FormData());

  constructor() {
    super();
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.init();
  }

  render() {
    return html`
      <details open>
        <summary>Mocks</summary>
        <fieldset>
          <form @change=${this.formChanged} @reset=${this.formReset}>
            <div>
              <label for="mocks">Enable Mocks</label>
              <input id="mocks" type="checkbox" name="mocks" .checked=${this.formData.value.has('mocks')}>
            </div>
            <div>
              <label for="delay">Delay</label>
              <input id="delay" type="checkbox" name="delay" .checked=${this.formData.value.has('delay')}>
            </div>
            <div>
              <label for="random-error">Random Error</label>
              <input id="random-error" type="checkbox" name="random-error" .checked=${this.formData.value.has('random-error')}>
            </div>
          </form>
        </fieldset>
      </details>
    `
  }

  init() {
    for (const [key, value] of Array.from(this.getUrlParams())) {
      this.formData.value.set(key, value);
    }
  }

  formReset(e: Event) {
    if (e.type !== 'reset') return;
    this.formData.value = new FormData();
  }

  formChanged() {
    if (!this.formData) return;
    const form = this.shadowRoot?.querySelector('form');
    if (!form) return;
    this.formData.value = new FormData(form);
    this.syncToURL();
  }

  syncToURL() {
    const params = new URLSearchParams();
    for (const [key] of Array.from(this.formData.value)) {
      params.set(key, '');
    }
    window.location.search = params.toString();
  }

  getUrlParams() {
    return new URLSearchParams(window.location.search);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-params-form': MyParamsForm
  }
}
