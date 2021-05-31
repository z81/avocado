import { createEvent, createStore } from 'effector';
import { storeService, toQueue } from '../lib/effector-effect-ts';
import { TvShow } from '../dataTypes/tvShow';
import { kinopoiskSearchQueue } from '../backend/modules/kinopoisk/queues';

export const searchTvShow = createEvent<string>();
export const setTvShows = createEvent<TvShow[]>();

export const setTvShowLoading = createEvent<boolean>();

export const $tvShowsLoadingStore = createStore(false).on(
  setTvShowLoading,
  (_, isLoading) => isLoading
);

const $tvShows = createStore<TvShow[]>([])
  .on(searchTvShow, toQueue(kinopoiskSearchQueue))
  .on(setTvShows, (_, tvShows) => tvShows);

export const { TvShowsStore, TvShowsStoreService, LiveTvShowsStoreService } =
  storeService('TvShows', $tvShows);
