import { TezosToolkit } from '@taquito/taquito';

import { rpc } from '../config/general';
export const Tezos = new TezosToolkit(rpc);
