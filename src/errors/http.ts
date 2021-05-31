/* eslint-disable max-classes-per-file */

export class HTTPTimeoutError {
  readonly _tag = 'TimeoutError';

  constructor(public readonly url: string) {}
}

export class HTTPNotFoundError {
  readonly _tag = 'NotFoundError';

  constructor(public readonly url: string) {}
}
