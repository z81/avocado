import * as T from '@effect-ts/core/Effect';
import { pipe } from '@effect-ts/core/Function';
import * as Chunk from '@effect-ts/core/Collections/Immutable/Chunk';
import * as A from '@effect-ts/core/Collections/Immutable/Array';
import * as cheerio from 'cheerio';
import { fetchPage } from '../fetch/fetchPage.resolver';

export const kinopoiskSearch = (title: string) =>
  T.gen(function* (_) {
    const baseUrl = 'https://www.kinopoisk.ru';
    const url = `${baseUrl}/index.php?kp_query=${encodeURIComponent(title)}`;
    const $ = cheerio.load(yield* _(fetchPage(url)));

    const result = yield* _(
      pipe(
        T.succeedWith(() => $('.element').toArray()),
        T.chain(
          T.forEachPar((row) =>
            T.succeed({
              poster: $(row).find('.pic .flap_img').attr('title'),
              title: $(row).find('.info .name a').text(),
              year: $(row).find('.info .name .year').text(),
              url: $(row).find('.info .name a').attr('href'),
            })
          )
        ),
        T.map(Chunk.filter((row) => Object.values(row).every(Boolean))),
        T.map(
          Chunk.map((row) => ({
            ...row,
            poster: `${baseUrl}${row.poster}`,
            seasons: [],
            kinopoiskUrl: `${baseUrl}${row.url}`,
            kinopoiskId: /film\/(\d+)\//.exec(row.url ?? '')?.[1] ?? '',
          }))
        ),
        T.map(Chunk.toArray),
        T.map(A.toMutable)
      )
    );

    return result;
  });
