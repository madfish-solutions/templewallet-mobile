import { BigNumber } from 'bignumber.js';
import { map } from 'rxjs/operators';

import { fetchApyFromYupana$ } from 'src/apis/yupana';
import { KNOWN_TOKENS_SLUGS } from 'src/token/data/token-slugs';

import { getYOUTokenApr$, getYouvesTokenApr$ } from '../../apis/youves';
import { YouvesTokensEnum } from '../../apis/youves/enums';
import { youvesTokensRecord } from '../../apis/youves/utils';
import { ExchangeRateRecord } from '../currency/currency-state';

export const fetchUSDTApy$ = () => {
  const slug = KNOWN_TOKENS_SLUGS.USDT;

  return fetchApyFromYupana$('USDT').pipe(map(val => ({ [slug]: val })));
};

export const fetchKUSDApy$ = () => {
  const slug = KNOWN_TOKENS_SLUGS.KUSD;

  return fetchApyFromYupana$('KUSD').pipe(map(val => ({ [slug]: val })));
};

export const fetchTzBtcApy$ = () => {
  const slug = KNOWN_TOKENS_SLUGS.tzBTC;

  return fetchApyFromYupana$('TZBTC').pipe(map(val => ({ [slug]: val })));
};

export const fetchUBTCApr$ = (rpcUrl: string) => {
  const slug = KNOWN_TOKENS_SLUGS.uBTC;

  return getYouvesTokenApr$(youvesTokensRecord[YouvesTokensEnum.UBTC], rpcUrl).pipe(map(value => ({ [slug]: value })));
};

export const fetchUUSDCApr$ = (rpcUrl: string) => {
  const slug = KNOWN_TOKENS_SLUGS.uUSD;

  return getYouvesTokenApr$(youvesTokensRecord[YouvesTokensEnum.UUSD], rpcUrl).pipe(map(value => ({ [slug]: value })));
};

export const fetchYOUApr$ = (tokenUsdExchangeRates: ExchangeRateRecord, rpcUrl: string) => {
  const slug = KNOWN_TOKENS_SLUGS.YOU;
  const assetToUsdExchangeRate = new BigNumber(tokenUsdExchangeRates[slug]);

  return getYOUTokenApr$(assetToUsdExchangeRate, assetToUsdExchangeRate, rpcUrl).pipe(
    map(value => ({ [slug]: value }))
  );
};
