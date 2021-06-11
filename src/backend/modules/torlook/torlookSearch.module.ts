import * as S from '@effect-ts/core/Effect/Stream';
import { pipe } from '@effect-ts/core/Function';
import { setTvSources } from '../../../stores/tvShowSources';
import { torlookSearchQueue } from './queues';
import { torlookSearch } from './torlookSearch.resolver';

export const torlookSearchModule = pipe(
  S.fromQueue(torlookSearchQueue),
  S.map(torlookSearch),
  S.chain(S.fromEffect),
  S.map(setTvSources),
  S.runCount
);
