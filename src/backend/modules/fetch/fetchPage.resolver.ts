import * as T from '@effect-ts/core/Effect';
import * as O from '@effect-ts/core/Option';
import { pipe } from '@effect-ts/core/Function';
import { fetchEffect, ResponseToPromise } from './fetch.service';
import { HTTPTimeoutError } from '../../../errors/http';

export const fetchPage = <T = string>(
  url: string,
  fn: ResponseToPromise<T> = (r) => r.text() as any,
  timeout = 15_000,
  cacheTime = 300_000
) =>
  pipe(
    fetchEffect(url, fn),
    T.cached(cacheTime),
    T.flatten,
    T.timeout(timeout),
    T.chain(O.fold(() => T.fail(new HTTPTimeoutError(url)), T.succeed))
  );
