import * as T from '@effect-ts/core/Effect';
import * as A from '@effect-ts/core/Collections/Immutable/Array';
import { pipe } from '@effect-ts/core/Function';
import * as Chunk from '@effect-ts/core/Collections/Immutable/Chunk';
import * as cheerio from 'cheerio';
import { fetchPage } from '../fetch/fetchPage.resolver';

export const kinopoiskGetInfo = (id: string) =>
  T.gen(function* (_) {
    const baseUrl = 'https://www.kinopoisk.ru';
    const url = `${baseUrl}/series/${encodeURIComponent(id)}`;
    const $main = cheerio.load(yield* _(fetchPage(url)));
    const $se = cheerio.load(
      yield* _(fetchPage(`${baseUrl}/film/${id}/episodes/`))
    );

    const seasonsItems = yield* _(
      T.succeedWith(() =>
        $se('.season_item')
          .toArray()
          .map((_, i) => ({
            number: i + 1,
          }))
      )
    );

    const result = yield* _(
      pipe(
        seasonsItems,
        T.forEachPar((se) =>
          pipe(
            $se(`[name="s${se.number}"]`)
              .next()
              .find('tbody tr td span')
              .parent()
              .toArray()
              .map((node, i) => ({
                number: i + 1,
                node,
              })),
            T.forEachPar(({ node, number }) =>
              T.succeedWith(() => ({
                number,
                title: $se(node).find('h1').text(),
              }))
            ),
            T.map(Chunk.toArray),
            T.map(A.toMutable),
            T.map((episodes) => ({
              episodes,
              number: se.number,
            }))
          )
        ),
        T.map(Chunk.toArray),
        T.map(A.toMutable),
        T.map((seasons) => ({
          fullPoster: `http:${$main('.film-poster').attr('src')}`,
          originalTitle: $main('[class^="styles_originalTitle"]').text(),
          kinopoiskRating: $main('a.film-rating-value').text(),
          kinopoiskId: id,
          seasons,
          imdbRating: $main(
            '[class^="styles_subRating"] [class^="styles_valueSection"]'
          )
            .text()
            .split(':')?.[1]
            ?.trim(),
        }))
      )
    );

    return result;
  });
