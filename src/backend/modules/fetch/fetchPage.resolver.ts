import * as T from '@effect-ts/core/Effect';
import * as O from '@effect-ts/core/Option';
import * as cheerio from 'cheerio';
import { pipe } from '@effect-ts/core/Function';
import { fetchText } from './fetch.service';
import { HTTPTimeoutError } from '../../../errors/http';

export const loadPage = (url: string, timeout = 15_000, cacheTime = 300_000) =>
  pipe(
    fetchText(url),
    T.cached(cacheTime),
    T.flatten,
    T.timeout(timeout),
    T.chain(O.fold(() => T.fail(new HTTPTimeoutError(url)), T.succeed)),
    T.map((_) => cheerio.load(_))
  );
