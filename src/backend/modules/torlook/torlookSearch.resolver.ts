import { range } from '@effect-ts/core/Collections/Immutable/Array';
import * as T from '@effect-ts/core/Effect';
import * as cheerio from 'cheerio';
import { fetchPage } from '../fetch/fetchPage.resolver';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const iconv = require('iconv-lite');

const getSeasons = (title: string) => {
  const seasonRes = /(сезон[ ]*[:]?[ ]*(\d+)|(\d+)[ ]*сезон|(S\d+))/gim.exec(
    title
  );
  const season = seasonRes
    ? +seasonRes[2] || +seasonRes[3] || +seasonRes[0].substr(1)
    : 0;

  const seasonRangeRes =
    /([(/|.,[]+[ ]*сезоны?[ ]*[:]?[ ]*(\d+)-(\d+)|(\d+)-(\d+)[ ]*сезоны?|S(\d+)-S?(\d+))/gim.exec(
      title
    );

  const seasonStart = seasonRangeRes
    ? Number(seasonRangeRes[2] || seasonRangeRes[4] || seasonRangeRes[6])
    : 0;
  const seasonEnd = seasonRangeRes
    ? Number(seasonRangeRes[3] || seasonRangeRes[5] || seasonRangeRes[7])
    : seasonStart;

  const seasons = seasonStart
    ? range(seasonStart, seasonEnd ?? seasonStart)
    : [season];

  return seasons.filter(Boolean);
};

export const getEpisodes = (title: string) => {
  const episodeRes = /(серия[ ]*[:]?[ ]*(\d+)|(\d+)[ ]*серия|(E\d+))/gim.exec(
    title
  );
  const episode =
    episodeRes &&
    (+episodeRes[2] || +episodeRes[3] || +episodeRes[0].substr(1));

  const episodeResRangeRes =
    // eslint-disable-next-line no-useless-escape
    /([(/|.,\[]+[ ]*сери[ий][ ]*[:]?[ ]*(\d+)-(\d+)|(\d+)-(\d+)[ ]*сери[ий]|E(\d+)-E?(\d+))|(\d+) из (\d+)|(\d+)-(\d+) из |\[(\d+)-(\d+)\]|серии (\d+)-(\d+)/gim.exec(
      title
    );

  const episodeResStart =
    episodeResRangeRes &&
    Number(
      episodeResRangeRes[2] ||
        episodeResRangeRes[4] ||
        episodeResRangeRes[6] ||
        episodeResRangeRes[8] ||
        episodeResRangeRes[10] ||
        episodeResRangeRes[12] ||
        episodeResRangeRes[14]
    );
  const episodeResEnd =
    episodeResRangeRes &&
    Number(
      episodeResRangeRes[3] ||
        episodeResRangeRes[5] ||
        episodeResRangeRes[7] ||
        episodeResRangeRes[9] ||
        episodeResRangeRes[11] ||
        episodeResRangeRes[13] ||
        episodeResRangeRes[15]
    );

  let episodes = episodeResEnd
    ? range(episodeResStart ?? 1, episodeResEnd)
    : [episode ?? 0];

  const episode2Res = /\[(\d+\+)?(\d+) из (\d+)(\+\d*)?\]/gim.exec(title);

  if (episode2Res) {
    const end = Number(episode2Res[1] || 0) + Number(episode2Res[2]) + 1;

    episodes = range(1, end);
  }

  return episodes.filter(Boolean);
};

const keyAliases = new Map([
  ['название', 'name'],
  ['качество', 'quality'],
  ['видео', 'video'],
  ['аудио', 'audio'],
  ['звук', 'audio'],
  ['перевод', 'translation'],
]);
const infoKeys = [...keyAliases].map(([k]) => k);

const parsePage = (url: string, tracker: string) =>
  T.gen(function* (_) {
    const pageArrBuffer = yield* _(fetchPage(url, (q) => q.arrayBuffer()));

    const page =
      tracker === 'rutracker'
        ? iconv.decode(Buffer.from(pageArrBuffer), 'win1251').toString()
        : new TextDecoder('utf-8').decode(pageArrBuffer);

    const text = page
      .replace(/<script(.+)script>/gim, '')
      .replace(/<.+?>/gim, '');

    const info: [string, string | number[]][] = [
      ...text.matchAll(/(.+?):(.+)/gi),
    ].flatMap(([, key, val]) => {
      const lowerKey = key.trim().toLowerCase();
      const infoKey = infoKeys.find((k) => lowerKey.startsWith(k));
      const name = infoKey && keyAliases.get(infoKey);

      return name ? [[name, val.trim()]] : [];
    });
    const title =
      /topic-title.+?">(.+)<\//gim
        .exec(page)?.[1]
        ?.replace(/<span .*?>/gim, '')
        .replace(/<\/span>/gim, '') ?? '';

    info.push(['title', title]);
    info.push(['seasons', getSeasons(title)]);
    info.push(['episodes', getEpisodes(title)]);
    info.push(['magnet', /<a href="(magnet:.*?)"/gim.exec(page)?.[1] ?? '']);

    const infoObject = Object.fromEntries(info);

    if (infoObject.episodes.length === 0) {
      infoObject.episodes = getEpisodes(infoObject.name as string);
    }

    if (infoObject.seasons.length === 0) {
      infoObject.seasons = getSeasons(infoObject.name as string);
    }

    return infoObject;
  });

export type TorLookSearchArg = {
  title: string;
  season: number;
  episode: number;
};

export const torlookSearch = (
  { title, season, episode }: TorLookSearchArg,
  limit = 5
) =>
  T.gen(function* (_) {
    const base = 'https://w38.torlook.info';
    const url = `${base}/${encodeURIComponent(title)}`;

    const $ = cheerio.load(yield* _(fetchPage(url)));

    const results = $('.webResult.item')
      .toArray()
      .map((item) => {
        const title = $(item).find('p > a').text();

        return {
          url: $(item).find('p > a').attr('href') ?? '',
          title,
          seasons: getSeasons(title),
          episodes: getEpisodes(title),
          tracker: /img\/(.*)\./gim.exec(
            $(item).find('.trackerIcon').attr('src') ?? ''
          )?.[1],
          size: $(item).find('.webResultTitle .size').text(),
          seeders: +$(item).find('.webResultTitle .seeders').text().trim(),
          leechers: +$(item).find('.webResultTitle .leechers').text().trim(),
          magnet: $(item).find('.webResultTitle .magnet a').attr('data-src'),
        };
      })
      .filter(
        (s) =>
          (season === 0 || s.seasons.includes(season)) &&
          (episode === 0 || s.episodes.includes(episode))
      )
      .slice(0, limit);

    const sources: Record<string, string | number | number[]>[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const u of results) {
      sources.push(yield* _(parsePage(u.url, u.tracker ?? '')));
    }

    return sources;
  });
