import axios from 'axios';
import { Observable } from 'rxjs';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';

import { GetAccountTokenBalancesResponseInterface } from './interfaces/get-account-token-balances-response.interface';
import { currentNetworkId$, tezos$ } from './utils/network/network.util';
import { mutezToTz } from './utils/tezos.util';

const BASE_URL = 'https://api.better-call.dev/v1';
export const api = axios.create({ baseURL: BASE_URL });

export const getAccountTokenBalancesRequest$ = () => (address$: Observable<string>) =>
  address$.pipe(
    withLatestFrom(currentNetworkId$),
    switchMap(([address, currentNetworkId]) =>
      api.get<GetAccountTokenBalancesResponseInterface>(`/account/${currentNetworkId}/${address}/token_balances`, {
        params: { size: 10, offset: 0 }
      })
    )
  );

export const getTezosBalanceRequest$ = () => (address$: Observable<string>) =>
  address$.pipe(
    withLatestFrom(tezos$),
    switchMap(([address, tezos]) => tezos.tz.getBalance(address)),
    map(mutezToTz)
  );
