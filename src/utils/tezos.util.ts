import { TezosToolkit } from '@taquito/taquito';

import { currentNetworkRpc$, rpc } from '../config/general';
import { map } from 'rxjs/operators';

export const tezos$ = currentNetworkRpc$.pipe(map(currentNetworkRpc => new TezosToolkit(currentNetworkRpc)));
export const Tezos = new TezosToolkit(rpc);
