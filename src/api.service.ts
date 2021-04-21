import axios, { AxiosResponse } from 'axios';
import { from, Observable } from 'rxjs';

import { network } from './config/general';
import { AssetsResponse } from './interfaces/assets.interface';

const BASE_URL = 'https://api.better-call.dev/v1';
const api = axios.create({ baseURL: BASE_URL });

export const getAssetsRequest$ = (address: string): Observable<AxiosResponse<AssetsResponse>> =>
  from(
    api.get(`/account/${network}/${address}/token_balances`, {
      params: {
        size: 10,
        offset: 0
      }
    })
  );
