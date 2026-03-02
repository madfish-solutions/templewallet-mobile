import { BigNumber } from 'bignumber.js';
import { map } from 'rxjs/operators';

import { getYOUTokenApr$, getYouvesTokenApr$ } from 'src/apis/youves';
import { YouvesTokensEnum } from 'src/apis/youves/enums';
import { youvesTokensRecord } from 'src/apis/youves/utils';
import { KNOWN_TOKENS_SLUGS } from 'src/token/data/token-slugs';

import { ExchangeRateRecord } from '../currency/currency-state';

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
