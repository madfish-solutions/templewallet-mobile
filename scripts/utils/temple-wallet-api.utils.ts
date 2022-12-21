import axios from 'axios';

import { getTokenSlug } from './asset.utils';

const templeWalletApi = axios.create({ baseURL: 'https://temple-api-mainnet.prod.templewallet.com/api' });

interface ExchangeRateItem {
  tokenAddress: string;
  tokenId?: number;
  exchangeRate: string;
}

type ExchangeRatesRecord = Record<string, number>;

export const loadExchangeRates = () =>
  templeWalletApi
    .get<ExchangeRateItem[]>('/exchange-rates')
    .then(reponse => {
      const resultRecord: ExchangeRatesRecord = {};

      for (const item of reponse.data) {
        resultRecord[getTokenSlug({ address: item.tokenAddress, id: item.tokenId })] = +item.exchangeRate;
      }

      return resultRecord;
    })
    .catch((error): ExchangeRatesRecord => {
      console.log(error);

      return {};
    });
