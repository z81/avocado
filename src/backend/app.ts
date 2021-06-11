import * as T from '@effect-ts/core/Effect';
import { pipe } from '@effect-ts/core/Function';
import { kinopoiskSearchModule } from './modules/kinopoisk/kinopoiskSearch.module';
import { LiveFetchService } from './modules/fetch/fetch.service';
import { kinopoiskGetInfoModule } from './modules/kinopoisk/kinopoiskGetInfo.module';
import { rutorSearchModule } from './modules/rutor/rutorSearch.module';
import { torlookSearchModule } from './modules/torlook/torlookSearch.module';

T.run(
  pipe(
    T.tuplePar(
      kinopoiskSearchModule,
      rutorSearchModule,
      kinopoiskGetInfoModule,
      torlookSearchModule
    ),
    T.provideSomeLayer(LiveFetchService)
  )
);
