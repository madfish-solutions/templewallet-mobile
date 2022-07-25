import { Source } from 'react-native-fast-image';

import { exolixApi } from '../api.service';
import {
  CurrenciesInterface,
  CurrenciesRequestInterface,
  ExchangeDataInterface,
  RateInterface
} from '../interfaces/exolix.interface';
import { isDefined } from './is-defined';

const currenciesLimit = 100;

export const TOPUP_TOKENS: Array<{ code: string; icon: Source }> = [
  { code: 'BTC', icon: require('./top-up-token-logos/btc.png') },
  { code: 'LTC', icon: require('./top-up-token-logos/ltc.png') },
  { code: 'DOGE', icon: require('./top-up-token-logos/doge.png') },
  { code: 'XMR', icon: require('./top-up-token-logos/xmr.png') },
  { code: 'ETH', icon: require('./top-up-token-logos/eth.png') },
  { code: 'AR', icon: require('./top-up-token-logos/ar.png') },
  { code: 'SOL', icon: require('./top-up-token-logos/sol.png') },
  { code: 'MATIC', icon: require('./top-up-token-logos/matic.png') },
  { code: 'DOT', icon: require('./top-up-token-logos/dot.png') },
  { code: 'KSM', icon: require('./top-up-token-logos/ksm.png') },
  { code: 'USDT', icon: require('./top-up-token-logos/usdt.png') },
  { code: 'UNI', icon: require('./top-up-token-logos/uni.png') },
  { code: '1INCH', icon: require('./top-up-token-logos/1inch.png') },
  { code: 'CRV', icon: require('./top-up-token-logos/crv.png') },
  { code: 'COMP', icon: require('./top-up-token-logos/comp.png') },
  { code: 'MKR', icon: require('./top-up-token-logos/mkr.png') },
  { code: 'RENBTC', icon: require('./top-up-token-logos/renbtc.png') },
  { code: 'YFI', icon: require('./top-up-token-logos/yfi.png') },
  { code: 'LINK', icon: require('./top-up-token-logos/link.png') },
  { code: 'SHIB', icon: require('./top-up-token-logos/shib.png') },
  { code: 'XVS', icon: require('./top-up-token-logos/xvs.png') },
  { code: 'CAKE', icon: require('./top-up-token-logos/cake.png') },
  { code: 'QUICK', icon: require('./top-up-token-logos/quick.png') },
  { code: 'LUNA', icon: require('./top-up-token-logos/luna.png') },
  { code: 'ATOM', icon: require('./top-up-token-logos/atom.png') },
  { code: 'SUSHI', icon: require('./top-up-token-logos/sushi.png') },
  { code: 'CELO', icon: require('./top-up-token-logos/celo.png') },
  { code: 'AVAX', icon: require('./top-up-token-logos/avax.png') },
  { code: 'AXS', icon: require('./top-up-token-logos/axs.png') },
  { code: 'EPS', icon: require('./top-up-token-logos/eps.png') },
  { code: 'EOS', icon: require('./top-up-token-logos/eos.png') },
  { code: 'FTM', icon: require('./top-up-token-logos/ftm.png') },
  { code: 'FLOW', icon: require('./top-up-token-logos/flow.png') },
  { code: 'KAVA', icon: require('./top-up-token-logos/kava.png') },
  { code: 'KSM', icon: require('./top-up-token-logos/ksm.png') },
  { code: 'NEAR', icon: require('./top-up-token-logos/near.png') },
  { code: 'sUSD', icon: require('./top-up-token-logos/susd.png') },
  { code: 'USDTERC20', icon: require('./top-up-token-logos/usdterc20.png') },
  { code: 'USDTBSC', icon: require('./top-up-token-logos/usdtbsc.png') }
];

export const loadExolixCurrencies = async (): Promise<Array<CurrenciesInterface>> => {
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

  return totalData.filter(currency => TOPUP_TOKENS.some(x => x.code === currency.code));
};

export const loadCurrency = async (page = 1) =>
  (await exolixApi.get<CurrenciesRequestInterface>('/currencies', { params: { size: currenciesLimit, page } })).data;

export const loadExolixRate = async (data: { coinFrom: string; coinTo: string; amount: number }) =>
  exolixApi
    .get('/rate', { params: data })
    .then(r => r.data as RateInterface)
    .catch(error => {
      if (isDefined(error.response)) {
        return error.response.data;
      }
    });

export const submitExolixExchange = (data: {
  coinFrom: string;
  coinTo: string;
  amount: number;
  withdrawalAddress: string;
  withdrawalExtraId: string;
}) => exolixApi.post<ExchangeDataInterface>('/transactions', data);

export const loadExolixExchangeData = (exchangeId: string) =>
  exolixApi.get<ExchangeDataInterface>(`/transactions/${exchangeId}`);

export const truncateLongAddress = (data: string) =>
  data.length > 10 ? data.slice(0, 5) + '...' + data.slice(-5) : data;
