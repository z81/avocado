import * as Q from '@effect-ts/core/Effect/Queue';
import { TorLookSearchArg } from './torlookSearch.resolver';

export const torlookSearchQueue = Q.unsafeMakeUnbounded<TorLookSearchArg>();
