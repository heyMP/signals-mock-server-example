import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js';
import { watchSignal } from '@heymp/signals/lit';
import { match, when, P } from 'ts-pattern';
import { UsersSignal } from './services/users.js';
import { UserSignal } from './services/user.js';
import { initMocks } from './mocks/init.js';
import './elements/my-user.js';

await initMocks();

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends LitElement {
  @watchSignal
  users = new UsersSignal();

  connectedCallback(): void {
    super.connectedCallback();
    this.users.update();
  }

  protected createRenderRoot() {
    return this;
  }

  render() {
    const content = match(this.users.state)
      .with('initial', () => this.renderLoadingState())
      .with('updating', () => this.renderLoadingState())
      .with('complete', () => this.renderDefaultState())
      .with('error', () => this.renderErrorState())
      .exhaustive()

    return html`
      <div>Service State: ${this.users.state}</div>
      <div>Service Children State: ${this.renderUsersServiceStatus()}</div>
      <button @click=${this.refresh}>refresh</button>
      ${content}
    `;
  }

  renderLoadingState() {
    return html`fetching users...`;
  }

  renderDefaultState() {
    const users = Array.from(this.users.value ?? []);

    users.sort((a, b) => {
      return (a.value?.isActive === b.value?.isActive) ? 0 : a.value?.isActive ? -1 : 1;
    });

    return html`
      <ul>
        ${repeat(users, (user) => user.value.id, this.renderUserListItem)}
      </ul>
    `
  }

  renderErrorState() {
    return html`oops there was an error 🫠`;
  }

  renderUserListItem(user: UserSignal) {
    return html`<li><my-user .user=${user}></my-user></li>`
  }

  renderUsersServiceStatus() {
    return match(this.users.childStates.value)
      .with(P.when(set => set.has('error')), () => html`🚨`)
      .with(P.when(set => 
        (set.size === 1 || set.size === 2) &&
        Array.from(set).every(value => value === 'complete' || value === 'initial')
      ), () => html`✅`)
      .otherwise(() => html`✨`)
  }

  /**
   * Refresh the user list
   */
  public refresh() {
    this.users.update();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}
