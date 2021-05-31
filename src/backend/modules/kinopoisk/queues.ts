import * as Q from '@effect-ts/core/Effect/Queue';
import { TvShow } from '../../../dataTypes/tvShow';

export const kinopoiskSearchQueue = Q.unsafeMakeUnbounded<string>();

export const kinopoiskGetInfoQueue = Q.unsafeMakeUnbounded<TvShow>();
