import { Store } from 'effector';
import * as T from '@effect-ts/core/Effect';
import * as Q from '@effect-ts/core/Effect/Queue';
import * as L from '@effect-ts/core/Effect/Layer';
import { tag, Tag } from '@effect-ts/core/Has';

export const toQueue =
  <T>(q: Q.Queue<T>) =>
  (_: unknown, value: T) => {
    T.run(Q.offer_(q, value));
  };

export type StoreService<
  N extends string,
  S,
  K extends `${N}Store` = `${N}Store`,
  SK extends `${K}Service` = `${K}Service`,
  LK extends `Live${SK}` = `Live${SK}`,
  ST = Store<S>
> = {
  [k in K | SK | LK]: k extends K
    ? ST
    : k extends SK
    ? Tag<ST>
    : k extends LK
    ? L.Layer<unknown, never, Tag<ST>>
    : never;
};

export const storeService = <T, N extends string>(
  name: N,
  store: Store<T>
): StoreService<N, T> => {
  const storeKey = `${name}Store`;
  const serviceKey = `${storeKey}Service`;
  const liveKey = `Live${serviceKey}`;

  store.shortName = name;
  const service = tag<typeof store>();
  const live = L.fromFunction(service)(() => store);

  return {
    [serviceKey]: service,
    [liveKey]: live,
    [storeKey]: store,
  } as StoreService<N, T>;
};
