import * as T from '@effect-ts/core/Effect';
import * as L from '@effect-ts/core/Effect/Layer';
import { tag } from '@effect-ts/core/Has';
import { flow, pipe } from '@effect-ts/core/Function';
import type { FetchError, Response } from 'node-fetch';
import type { _A } from '@effect-ts/core/Utils';
import fetch from 'node-fetch';

const abortController = new AbortController();

type ResponseToPromise<T> = (r: Response) => Promise<T>;

const fetchEffect =
  <T>(fn: ResponseToPromise<T>) =>
  (url: string) =>
    T.effectAsyncInterrupt<unknown, FetchError, T>((resolve) => {
      fetch(url, abortController)
        .then(fn)
        .then(flow(T.succeed, resolve))
        .catch(flow(T.fail, resolve));

      return T.succeedWith(abortController.abort);
    });

const makeFetchService = pipe(
  T.succeedWith(() => {
    return {
      fetchJSON: flow(fetchEffect<unknown>((t) => t.json())),
      fetchText: flow(fetchEffect<string>((t) => t.text())),
    };
  })
);

export type FetchService = _A<typeof makeFetchService>;
export const FetchService = tag<FetchService>();

export const LiveFetchService = L.fromEffect(FetchService)(makeFetchService);

export const fetchText = (url: string) =>
  T.accessServiceM(FetchService)(({ fetchText }) => fetchText(url));
