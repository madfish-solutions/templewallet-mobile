import { mainnetTokens } from 'youves-sdk/dist/networks.mainnet';

import { YouvesTokensEnum } from './enums';

export const MAINNET_SMARTPY_RPC = 'https://mainnet.smartpy.io';
const YOUVES_INDEXER_URL = 'https://youves-mainnet-indexer.prod.gke.papers.tech/v1/graphql';
export const YOUVES_TOKENS: string[] = [YouvesTokensEnum.YOU, YouvesTokensEnum.UBTC, YouvesTokensEnum.UUSD];
export const INITIAL_APR_VALUE = 0;
export const INDEXER_CONFIG = { url: YOUVES_INDEXER_URL, headCheckUrl: '' };
export const YOUVES_TOKENS_ICONS = {
  [mainnetTokens.youToken.id]: 'ipfs://QmYAJaJvEJuwvMEgRbBoAUKrTxRTT22nCC9RuY7Jy4L4Gc',
  [mainnetTokens.uusdToken.id]: 'ipfs://QmbvhanNCxydZEbGu1RdqkG3LcpNGv7XYsCHgzWBXnmxRd',
  [mainnetTokens.ubtcToken.id]: 'ipfs://Qmbev41h4axBqVzxsXP2NSaAF996bJjJBPb8FFZVqTvJTY',
  [mainnetTokens.uxtzToken.id]: 'ipfs://QmZe16xqundEf6JcRuct6gmoUE7wQM5cNHWPLrZhUY3v6Z'
};
