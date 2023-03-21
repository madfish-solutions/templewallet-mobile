import { KNOWN_TOKENS_SLUGS } from 'src/token/data/token-slugs';

export const YUPANA_LINK = 'https://app.yupana.finance/lending';
export const KORDFI_LINK = 'https://kord.fi/lend';
const YOUVES_LINK = 'https://app.youves.com/earn';

export const TOKEN_APY_LINKS: Readonly<Record<string, string | undefined>> = {
  [KNOWN_TOKENS_SLUGS.KUSD]: YUPANA_LINK,
  [KNOWN_TOKENS_SLUGS.USDT]: YUPANA_LINK,
  [KNOWN_TOKENS_SLUGS.tzBTC]: YUPANA_LINK,
  [KNOWN_TOKENS_SLUGS.YOU]: YOUVES_LINK,
  [KNOWN_TOKENS_SLUGS.uUSD]: YOUVES_LINK,
  [KNOWN_TOKENS_SLUGS.uBTC]: YOUVES_LINK
};
