import { TezosToolkit } from '@taquito/taquito';
import { map } from 'rxjs/operators';

import { currentNetworkRpc$ } from './network/network.util';

export const tezos$ = currentNetworkRpc$.pipe(map(currentNetworkRpc => new TezosToolkit(currentNetworkRpc)));
