import { Season } from './season';

export type TvShow = {
  title: string;
  kinopoiskUrl: string;
  poster: string;
  year: string;
  fullPoster?: string;
  imdbRating?: string;
  kinopoiskRating?: string;
  originalTitle?: string;
  kinopoiskId: string;
  seasons: Season[];
};
