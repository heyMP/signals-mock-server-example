import { http, delay, HttpResponse } from 'msw';
import { random } from '../lib/random.js';
import { users } from './data/users.js';
import * as ParamOptions from './queryParamOptions.js';

const params = new URLSearchParams(window.location.search);
 
export const handlers = [
  // Intercept "GET https://example.com/user" requests...
  http.get('https://example.com/users', async () => {
    await delay(ParamOptions.userDelay);

    if (params.has('users')) {
      const opt = params.get('users');
      if (opt === '403') {
        return new HttpResponse('Access denied', {
          status: 403
        })
      }
    }

    return HttpResponse.json(users);
  }),

  http.post('https://example.com/users/:id/activate', async ({ params }) => {
    await delay(ParamOptions.userDelay);
    const { id } = params;
    const user = users.find(i => i.id === id);

    if (random({ threshold: ParamOptions.randomError })) {
      return HttpResponse.error();
    }

    if (user) {
      user.isActive = true;
    }

    return HttpResponse.json(user);
  }),

  http.post('https://example.com/users/:id/deactivate', async ({ params }) => {
    await delay(ParamOptions.userDelay);
    const { id } = params;
    const user = users.find(i => i.id === id);

    if (random({ threshold: ParamOptions.randomError })) {
      return HttpResponse.error();
    }

    if (user) {
      user.isActive = false;
    }

    return HttpResponse.json(user);
  }),
]
