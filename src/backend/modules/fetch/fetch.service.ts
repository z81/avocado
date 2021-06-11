import * as T from '@effect-ts/core/Effect';
import * as L from '@effect-ts/core/Effect/Layer';
import { tag } from '@effect-ts/core/Has';
import { flow, pipe } from '@effect-ts/core/Function';
import type { FetchError, Response } from 'node-fetch';
import type { _A } from '@effect-ts/core/Utils';
import fetch from 'node-fetch';

const abortController = new AbortController();

export type ResponseToPromise<T> = (r: Response) => Promise<T>;

const _fetchEffect =
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
      fetchJSON: flow(_fetchEffect<unknown>((t) => t.json())),
      fetchText: flow(_fetchEffect<string>((t) => t.text())),
      fetchBuffer: flow(_fetchEffect<Buffer>((t) => t.buffer())),
      fetchEffect: _fetchEffect,
    };
  })
);

export type FetchService = _A<typeof makeFetchService>;
export const FetchService = tag<FetchService>();

export const LiveFetchService = L.fromEffect(FetchService)(makeFetchService);

export const fetchText = (url: string) =>
  T.accessServiceM(FetchService)(({ fetchText }) => fetchText(url));

export const fetchEffect = <T>(url: string, clb: ResponseToPromise<T>) =>
  T.accessServiceM(FetchService)(({ fetchEffect }) => fetchEffect(clb)(url));
