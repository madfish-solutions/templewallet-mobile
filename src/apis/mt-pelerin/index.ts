import { valueEncoder } from '@taquito/local-forging/dist/lib/michelson/codec';
import axios from 'axios';
import { URL } from 'react-native-url-polyfill';
import { firstValueFrom } from 'rxjs';

import { templeWalletApi } from 'src/api.service';
import { Shelter } from 'src/shelter/shelter';
import { MT_PELERIN_ACTIVATION_KEY, MT_PELERIN_REF_CODE } from 'src/utils/env.utils';

import { MT_PELERIN_API_URL, MT_PELERIN_LOGO_URL, MT_PELERIN_PRIMARY_COLOR, MT_PELERIN_WIDGET_URL } from './consts';
import {
  BuildMtPelerinBuyUrlParams,
  MtPelerinAddressProof,
  MtPelerinCurrenciesResponse,
  MtPelerinQuote,
  MtPelerinSellLimitResponse
} from './types';

const mtPelerinApi = axios.create({ baseURL: MT_PELERIN_API_URL });
const cardPaymentFiatCodes = ['CHF', 'EUR', 'USD', 'GBP'];

export const getMtPelerinAssets = () =>
  templeWalletApi.get<MtPelerinCurrenciesResponse>('/mtpelerin-assets').then(({ data }) => data);

export const getMtPelerinConvertQuote = async (
  sourceCurrency: string,
  destCurrency: string,
  sourceAmount: number,
  destNetwork: string
) => {
  const { data } = await mtPelerinApi.post<MtPelerinQuote>('/currency_rates/convert', {
    sourceCurrency,
    destCurrency,
    sourceAmount,
    sourceNetwork: 'fiat',
    destNetwork,
    isCardPayment: true
  });

  return data;
};

export const getMtPelerinOutputAmount = async (
  sourceCurrency: string,
  destCurrency: string,
  sourceAmount: number,
  destNetwork: string
) => {
  const { destAmount } = await getMtPelerinConvertQuote(sourceCurrency, destCurrency, sourceAmount, destNetwork);
  const outputAmount = Number(destAmount);

  if (!Number.isFinite(outputAmount) || outputAmount <= 0) {
    throw new Error('Mt Pelerin returned an invalid output amount');
  }

  return outputAmount;
};

export const getMtPelerinSellLimit = async (currency: string) => {
  const { data } = await mtPelerinApi.get<MtPelerinSellLimitResponse>(`/currency_rates/sellLimits/${currency}`);
  const limit = Number(data.limit);

  if (!Number.isFinite(limit) || limit <= 0) {
    throw new Error('Mt Pelerin returned an invalid sell limit');
  }

  return limit;
};

export const createMtPelerinAddressProof = async (accountPkh: string): Promise<MtPelerinAddressProof> => {
  const code = String(1000 + Math.floor(Math.random() * 9000));
  const message = `Tezos Signed Message: MtPelerin-${code}`;
  const bytes = `05${valueEncoder({ string: message })}`;
  const signer = await firstValueFrom(Shelter.getSigner$(accountPkh));
  const [publicKey, { prefixSig }] = await Promise.all([signer.publicKey(), signer.sign(bytes)]);

  return { accountPkh, publicKey, code, signature: prefixSig };
};

export const buildMtPelerinBuyUrl = ({
  fiatCode,
  cryptoCode,
  sourceAmount,
  network,
  accountPkh,
  publicKey,
  code,
  signature
}: BuildMtPelerinBuyUrlParams) => {
  const message = `Tezos Signed Message: MtPelerin-${code}`;
  const hash = [
    '-----BEGIN TEZOS SIGNED MESSAGE-----',
    message,
    '-----BEGIN SIGNATURE-----',
    publicKey,
    signature,
    '-----END TEZOS SIGNED MESSAGE-----'
  ].join('\n');
  const url = new URL(MT_PELERIN_WIDGET_URL);

  url.searchParams.set('_ctkn', MT_PELERIN_ACTIVATION_KEY);
  url.searchParams.set('type', 'direct-link');
  url.searchParams.set('lang', 'en');
  url.searchParams.set('tab', 'buy');
  url.searchParams.set('tabs', 'buy');
  url.searchParams.set('rfr', MT_PELERIN_REF_CODE);
  url.searchParams.set('bsc', fiatCode);
  url.searchParams.set('bdc', cryptoCode);
  url.searchParams.set('bsa', String(sourceAmount));
  url.searchParams.set('curs', fiatCode);
  url.searchParams.set('crys', cryptoCode);
  url.searchParams.set('dnet', network);
  url.searchParams.set('nets', network);
  if (cardPaymentFiatCodes.includes(fiatCode)) {
    url.searchParams.set('pm', 'card');
  }
  url.searchParams.set('primary', MT_PELERIN_PRIMARY_COLOR);
  url.searchParams.set('mylogo', MT_PELERIN_LOGO_URL);
  url.searchParams.set('addr', accountPkh);
  url.searchParams.set('code', code);
  url.searchParams.set('hash', hash);

  return url.toString();
};
