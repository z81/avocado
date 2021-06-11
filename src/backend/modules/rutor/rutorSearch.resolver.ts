import * as T from '@effect-ts/core/Effect';
import * as ST from '@effect-ts/core/String';
import { fetchPage } from '../fetch/fetchPage.resolver';

export const rutorSearch = (title: string, limit = 1) =>
  T.gen(function* (_) {
    console.log('TEST');

    const rutorBase = 'https://rutor.theproxy.ws';
    const url = `${rutorBase}/search/0/0/000/2/${encodeURIComponent(title)}`;
    const linkRegEx = /href="(\/torrent\/(\d+)\/.+?)"/g;

    const page = yield* _(fetchPage(url));
    const linksParts = yield* _(ST.matchAll_(page, linkRegEx));
    const urls = linksParts
      .map(([, url]) => `${rutorBase}${encodeURIComponent(url)}`)
      .slice(0, limit);

    // for (const u of urls) {
    //   const p = yield* _(parsePage(u))

    //   console.log(p)
    // }

    // console.log(urls)

    return urls;
  });
