import * as S from '@effect-ts/core/Effect/Stream';
import { pipe } from '@effect-ts/core/Function';
import { rutorSearchQueue } from './queues';
import { rutorSearch } from './rutorSearch.resolver';

export const rutorSearchModule = pipe(
  S.fromQueue(rutorSearchQueue),
  S.map(rutorSearch),
  S.chain(S.fromEffect),
  S.map((info) => {
    console.log(info);

    // return setTvShows(tvShows);
    return 1;
  }),
  S.runCount
);
