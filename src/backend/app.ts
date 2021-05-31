import * as T from '@effect-ts/core/Effect';
import { pipe } from '@effect-ts/core/Function';
import { kinopoiskSearchModule } from './modules/kinopoisk/kinopoiskSearch.module';
import { LiveFetchService } from './modules/fetch/fetch.service';
import { kinopoiskGetInfoModule } from './modules/kinopoisk/kinopoiskGetInfo.module';

T.run(
  pipe(
    kinopoiskSearchModule,
    T.zipPar(kinopoiskGetInfoModule),
    T.provideSomeLayer(LiveFetchService)
  )
);
