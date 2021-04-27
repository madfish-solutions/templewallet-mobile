import axios from 'axios';
import { Observable } from 'rxjs';
import { switchMap, withLatestFrom } from 'rxjs/operators';

import { currentNetworkId$, tezos$ } from './utils/network/network.util';

const BASE_URL = 'https://api.better-call.dev/v1';
const api = axios.create({ baseURL: BASE_URL });

export const getAssetsRequest$ = () => (address$: Observable<string>) =>
  address$.pipe(
    withLatestFrom(currentNetworkId$),
    switchMap(([address, currentNetworkId]) =>
      api.get(`/account/${currentNetworkId}/${address}/token_balances`, {
        params: {
          size: 10,
          offset: 0
        }
      })
    )
  );

export const getTezosBalanceRequest$ = () => (address$: Observable<string>) =>
  address$.pipe(
    withLatestFrom(tezos$),
    switchMap(([address, tezos]) => tezos.tz.getBalance(address))
  );
