import axios from 'axios';

import { exolixApi } from 'src/api.service';
import {
  ExolixCurrenciesResponseInterface,
  ExchangeDataInterface,
  GetRateRequestData,
  GetRateResponse,
  GetRateResponseWithAmountTooLow,
  SubmitExchangePayload
} from 'src/interfaces/exolix.interface';
import { TopUpInputInterface } from 'src/interfaces/topup.interface';
import { outputTokensList } from 'src/screens/buy/crypto/exolix/config';

import { isDefined } from './is-defined';
import { isTruthy } from './is-truthy';

const currenciesLimit = 100;

export const loadExolixCurrencies = async (): Promise<Array<TopUpInputInterface>> => {
  let page = 1;
  let result = await loadCurrency(page);
  let totalData = result.data;
  while (isDefined(result) && isDefined(result.data) && result.data.length === currenciesLimit) {
    page++;
    result = await loadCurrency(page);
    if (isDefined(result) && isDefined(result.data)) {
      totalData = totalData.concat(result.data);
    }
  }

  return totalData
    .map(({ code, icon, name, networks }) =>
      networks.map(network => ({
        code,
        icon,
        name,
        network: {
          code: network.network,
          fullName: network.name,
          shortName: isTruthy(network.shortName) ? network.shortName : undefined
        }
      }))
    )
    .flat()
    .filter(
      ({ name, network }) =>
        outputTokensList.find(
          outputToken => outputToken.name === name && outputToken.network?.code === network.code
        ) === undefined
    );
};

const loadCurrency = async (page = 1) =>
  exolixApi
    .get<ExolixCurrenciesResponseInterface>('/currencies', {
      params: { size: currenciesLimit, page, withNetworks: true }
    })
    .then(r => r.data);

export const loadExolixRate = async (data: GetRateRequestData) =>
  exolixApi.get<GetRateResponse>('/rate', { params: { ...data, rateType: 'fixed' } }).then(
    r => r.data,
    (error: unknown) => {
      if (axios.isAxiosError(error) && error.response && error.response.status === 422) {
        const data = error.response.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof data === 'object' && data != null && (data as any).error == null) {
          return data as GetRateResponseWithAmountTooLow;
        }
      }
      console.error(error);
      throw error;
    }
  );

export const submitExolixExchange = (data: SubmitExchangePayload) =>
  exolixApi.post<ExchangeDataInterface>('/transactions', { ...data, rateType: 'fixed' });

export const loadExolixExchangeData = (exchangeId: string) =>
  exolixApi.get<ExchangeDataInterface>(`/transactions/${exchangeId}`);

export const truncateLongAddress = (data: string) =>
  data.length > 10 ? data.slice(0, 5) + '...' + data.slice(-5) : data;
