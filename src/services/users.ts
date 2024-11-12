import { State, SignalUpdatedEvent, Computed } from '@heymp/signals';
import { User } from '../types.js';
import { fetchWrapper } from '../lib/fetchWrapper.js';
import { UserSignal } from './user.js';

export const usersSignalStates = ['initial', 'updating', 'complete', 'error'] as const;

export type UsersSignalState = typeof usersSignalStates[number];

export class UsersSignal extends State<UserSignal[] | undefined> {
  constructor(value?: UserSignal[]) {
    super(value);
    this.#watchChildren();
  }

  childStates = new Computed(() => {
    return new Set(this.value?.map(i => i.state));
  }, [this]);

  error?: Error;

  #state: UsersSignalState = 'initial';

  get state() {
    return this.#state;
  }

  set state(state: UsersSignalState) {
    const prev = this.#state;
    if (prev !== state) {
      this.#state = state;
      this.dispatchEvent(new SignalUpdatedEvent(prev, this.#state));
    }
  }

  async #watchChildren() {
    let abortCtrl: AbortController | undefined = undefined;

    for await (const value of this.stream()) {
      if (!value) { continue };

      abortCtrl?.abort();
      abortCtrl = new AbortController();

      for (const signal of value) {
        signal.addEventListener('updated', () => {
          this.dispatchEvent(new SignalUpdatedEvent(this.value, this.value));
        }, { signal: abortCtrl?.signal })
      }
    }
  }

  async update() {
    this.state = 'updating';
    this.value = [];
    const { data, error } = await fetchWrapper<User[]>({ url: 'https://example.com/users' });

    if (error) {
      this.state = 'error';
      return { error };
    }

    this.value = data.map(i => new UserSignal(i));

    this.state = 'complete';

    return { data };
  }
}
