import axios from 'axios';
import { AssetsResponse, GetAssetsParams } from './interfaces/assets.interface';

export const BASE_URL = 'https://api.better-call.dev/v1';
export const api = axios.create({ baseURL: BASE_URL });

export async function requestGetAssets(params: GetAssetsParams): Promise<AssetsResponse> {
  const { network, address, ...queryParams } = params;
  const r = await api.get(`/account/${params.network}/${params.address}/token_balances`, {
    params: queryParams
  });
  return r.data;
}
