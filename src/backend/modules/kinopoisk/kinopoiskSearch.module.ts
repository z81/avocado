import * as T from '@effect-ts/core/Effect';
import { pipe, flow } from '@effect-ts/core/Function';
import * as S from '@effect-ts/core/Effect/Stream';
import { setTvShowLoading, setTvShows } from '../../../stores/tvShowStore';
import { kinopoiskSearch } from './kinopoiskSearch.resolver';
import { kinopoiskSearchQueue } from './queues';

export const kinopoiskSearchModule = pipe(
  S.fromQueue(kinopoiskSearchQueue),
  S.debounce(150),
  S.filter((q) => q.length > 3),
  S.tap(() => T.succeed(setTvShowLoading(true))),
  S.map(flow(kinopoiskSearch, T.map(setTvShows))),
  S.chain(S.fromEffect),
  S.tap(() => T.succeed(setTvShowLoading(false))),
  S.runCount
);
