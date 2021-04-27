import { TransactionOperation } from '@taquito/taquito/dist/types/operations/transaction-operation';
import axios, { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js';
import { combineLatest, from, Observable } from 'rxjs';

import { currentNetworkId$ } from './config/general';
import { AssetsResponse } from './interfaces/asset.interface';
import { SendInterface } from './store/types';
import { Tezos } from './utils/tezos.util';
import { switchMap } from 'rxjs/operators';

const BASE_URL = 'https://api.better-call.dev/v1';
const api = axios.create({ baseURL: BASE_URL });

export const getAssetsRequest$ = (address: string): Observable<AxiosResponse<AssetsResponse>> =>
  combineLatest([currentNetworkId$]).pipe(
    switchMap(currentNetworkId =>
      api.get(`/account/${currentNetworkId}/${address}/token_balances`, {
        params: {
          size: 10,
          offset: 0
        }
      })
    )
  );

export const getTezosBalanceRequest$ = (address: string): Observable<BigNumber> => from(Tezos.tz.getBalance(address));

export const sendTezosRequest$ = ({ amount, to }: SendInterface): Observable<TransactionOperation> => {
  return from(Tezos.contract.transfer({ to: to, amount: parseInt(amount) }));
};
