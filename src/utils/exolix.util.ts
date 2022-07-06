import { exolixApi } from '../api.service';
import {
  CurrenciesInterface,
  CurrenciesRequestInterface,
  ExchangeDataInterface,
  RateInterface
} from '../interfaces/exolix.interface';
import { isDefined } from './is-defined';

const currenciesLimit = 100;

const coinList = [
  'BTC',
  'LTC',
  'DOGE',
  'XMR',
  'ETH',
  'AR',
  'SOL',
  'MATIC',
  'DOT',
  'KSM',
  'USDT',
  'UNI',
  '1INCH',
  'CRV',
  'COMP',
  'MKR',
  'RENBTC',
  'YFI',
  'LINK',
  'SHIB',
  'XVS',
  'CAKE',
  'QUICK',
  'LUNA',
  'ATOM',
  'SUSHI',
  'CELO',
  'AVAX',
  'AXS',
  'EPS',
  'EOS',
  'FTM',
  'FLOW',
  'KAVA',
  'KSM',
  'NEAR',
  'sUSD',
  'USDTERC20',
  'USDTBSC'
];

export const loadExolixCurrencies = async (): Promise<Array<CurrenciesInterface>> => {
  let page = 1;
  let result = await loadCurrency(page);
  const totalData = result.data;
  while (isDefined(result) && isDefined(result.data) && result.data.length === currenciesLimit) {
    page++;
    result = await loadCurrency(page);
    if (isDefined(result) && isDefined(result.data)) {
      totalData.concat(result.data);
    }
  }

  return new Promise(resolve => resolve(totalData.filter(currency => coinList.includes(currency.code))));
};

export const loadCurrency = async (page = 1) =>
  (await exolixApi.get<CurrenciesRequestInterface>('/currencies', { params: { size: currenciesLimit, page } })).data;

export const loadExolixRate = async (data: { coinFrom: string; coinTo: string; amount: number }) => {
  return exolixApi
    .get('/rate', { params: data })
    .then(r => r.data as RateInterface)
    .catch(error => {
      if (isDefined(error.response)) {
        return error.response.data;
      }
    });
};

export const submitExolixExchange = (data: {
  coinFrom: string;
  coinTo: string;
  amount: number;
  withdrawalAddress: string;
  withdrawalExtraId: string;
}) => exolixApi.post<ExchangeDataInterface>('/transactions', data);

export const loadExolixExchangeData = (exchangeId: string) =>
  exolixApi.get<ExchangeDataInterface>(`/transactions/${exchangeId}`);
