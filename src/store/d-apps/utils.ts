import { map } from 'rxjs/operators';

import { getYouvesTokenApr$ } from 'src/apis/youves';
import { YouvesTokensEnum } from 'src/apis/youves/enums';
import { youvesTokensRecord } from 'src/apis/youves/utils';
import { KNOWN_TOKENS_SLUGS } from 'src/token/data/token-slugs';

export const fetchUBTCApr$ = () => {
  const slug = KNOWN_TOKENS_SLUGS.uBTC;

  return getYouvesTokenApr$(youvesTokensRecord[YouvesTokensEnum.UBTC]).pipe(map(value => ({ [slug]: value })));
};

export const fetchUUSDCApr$ = () => {
  const slug = KNOWN_TOKENS_SLUGS.uUSD;

  return getYouvesTokenApr$(youvesTokensRecord[YouvesTokensEnum.UUSD]).pipe(map(value => ({ [slug]: value })));
};
