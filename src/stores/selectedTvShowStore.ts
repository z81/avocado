import { createStore, combine, createEvent } from 'effector';
import { kinopoiskGetInfoQueue } from '../backend/modules/kinopoisk/queues';
import { TvShow } from '../dataTypes/tvShow';
import { toQueue } from '../lib/effector-effect-ts';
import { TvShowsStore } from './tvShowStore';

export const selectTvShow = createEvent<string | null>();
export const getTvShowInfo = createEvent<TvShow>();

export const $selectedTvShowId = createStore<string | null>(null).on(
  selectTvShow,
  (_, id) => id
);

export const $selectedTvShow = combine($selectedTvShowId, TvShowsStore)
  .map(([id, tvShows]) => tvShows.find((tv) => tv.kinopoiskId === id))
  .on(getTvShowInfo, toQueue(kinopoiskGetInfoQueue));
