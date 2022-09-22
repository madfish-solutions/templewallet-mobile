import { exolixApi } from '../api.service';
import {
  ExolixCurrenciesResponseInterface,
  ExchangeDataInterface,
  RateInterface,
  SubmitExchangePayload
} from '../interfaces/exolix.interface';
import { TopUpInputInterface } from '../interfaces/topup.interface';
import { outputTokensList } from '../screens/buy/crypto/exolix/config';
import { isDefined } from './is-defined';

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
        network: network.network,
        networkFullName: network.name,
        networkShortName: network.shortName === '' ? null : network.shortName
      }))
    )
    .flat()
    .filter(
      ({ name, network }) =>
        outputTokensList.find(outputToken => outputToken.name === name && outputToken.network === network) === undefined
    );
};

export const loadCurrency = async (page = 1) =>
  exolixApi
    .get<ExolixCurrenciesResponseInterface>('/currencies', {
      params: { size: currenciesLimit, page, withNetworks: true }
    })
    .then(r => r.data);

export const loadExolixRate = async (data: { coinFrom: string; coinTo: string; amount: number }) =>
  exolixApi
    .get('/rate', { params: { ...data, rateType: 'fixed' } })
    .then(r => r.data as RateInterface)
    .catch(error => {
      if (isDefined(error.response)) {
        return error.response.data;
      }
    });

export const submitExolixExchange = (data: SubmitExchangePayload) =>
  exolixApi.post<ExchangeDataInterface>('/transactions', { ...data, rateType: 'fixed' });

export const loadExolixExchangeData = (exchangeId: string) =>
  exolixApi.get<ExchangeDataInterface>(`/transactions/${exchangeId}`);

export const truncateLongAddress = (data: string) =>
  data.length > 10 ? data.slice(0, 5) + '...' + data.slice(-5) : data;
