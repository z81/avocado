import { createStore, createEvent } from 'effector';
import { torlookSearchQueue } from '../backend/modules/torlook/queues';
import { TorLookSearchArg } from '../backend/modules/torlook/torlookSearch.resolver';
import { toQueue } from '../lib/effector-effect-ts';

type TvSource = Record<string, string | number | number[]>;

export const setTvSources = createEvent<TvSource[]>();
export const searchSources = createEvent<TorLookSearchArg>();

export const $tvShowSources = createStore<TvSource[]>([])
  .on(setTvSources, (_, sources) => sources)
  .on(searchSources, toQueue(torlookSearchQueue));
