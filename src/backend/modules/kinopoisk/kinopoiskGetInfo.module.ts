import * as S from '@effect-ts/core/Effect/Stream';
import { pipe } from '@effect-ts/core/Function';
import { kinopoiskGetInfo } from './kinopoiskGetInfo.resolver';
import { kinopoiskGetInfoQueue } from './queues';
import { setTvShows, TvShowsStore } from '../../../stores/tvShowStore';

export const kinopoiskGetInfoModule = pipe(
  S.fromQueue(kinopoiskGetInfoQueue),
  S.map((tvShow) => kinopoiskGetInfo(tvShow.kinopoiskId)),
  S.chain(S.fromEffect),
  S.map((info) => {
    const tvShows = TvShowsStore.getState().map((tvShow) =>
      info.kinopoiskId === tvShow.kinopoiskId ? { ...tvShow, ...info } : tvShow
    );
    return setTvShows(tvShows);
  }),
  S.runCount
);
