import { map } from 'rxjs/operators';

import { fetchApyFromYupana$ } from 'src/apollo/yupana';
import { KNOWN_TOKENS_SLUGS } from 'src/token/data/token-slugs';

export const fetchKUSDApy$ = () => {
  const slug = KNOWN_TOKENS_SLUGS.KUSD;

  return fetchApyFromYupana$('KUSD').pipe(map(val => ({ [slug]: val })));
};

export const fetchTzBtcApy$ = () => {
  const slug = KNOWN_TOKENS_SLUGS.tzBTC;

  return fetchApyFromYupana$('TZBTC').pipe(map(val => ({ [slug]: val })));
};
