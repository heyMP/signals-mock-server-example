const params = new URLSearchParams(window.location.search);

export const userDelay = params.has('delay')
  ? params.get('delay') === ''
    ? undefined
    : Number(params.get('delay'))
  : 0;

export const userCount = params.has('user-count')
  ? params.get('user-count') === ''
    ? 10
    : Number(params.get('user-count'))
  : 10;

export const randomError = params.has('random-error')
  ? params.get('random-error') === ''
    ? .8
    : Number(params.get('random-error'))
  : 1;
