import { KNOWN_TOKENS_SLUGS } from 'src/token/data/token-slugs';

const YOUVES_LINK = 'https://app.youves.com/earn';

export const TOKEN_APY_LINKS: Readonly<Record<string, string | undefined>> = {
  [KNOWN_TOKENS_SLUGS.YOU]: YOUVES_LINK,
  [KNOWN_TOKENS_SLUGS.uUSD]: YOUVES_LINK,
  [KNOWN_TOKENS_SLUGS.uBTC]: YOUVES_LINK
};

export const APY_LINK_SELECTORS: Readonly<Record<string, string>> = {
  [YOUVES_LINK]: 'TokenPage/Youves/Apy'
};
