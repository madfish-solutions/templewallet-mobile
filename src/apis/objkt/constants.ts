import { getApolloConfigurableClient } from 'src/apollo/utils/get-apollo-configurable-client.util';

import { CurrencyInfo } from './interfaces';

const OBJKT_API = 'https://data.objkt.com/v3/graphql/';

export const OBJKT_CONTRACT = 'KT1WvzYHCNBvDSdwafTHv7nJ1dWmZ8GCYuuC';

export const apolloObjktClient = getApolloConfigurableClient(OBJKT_API);

export const currencyInfoById: Record<number, CurrencyInfo> = {
  23: {
    symbol: 'uUSD',
    decimals: 12
  },
  218: {
    symbol: 'USDtz',
    decimals: 6
  },
  1: {
    symbol: 'TEZ',
    decimals: 6
  },
  4: {
    symbol: 'oXTZ',
    decimals: 6
  },
  1924: {
    symbol: 'USDTz',
    decimals: 6
  },
  1872: {
    symbol: 'uUSD',
    decimals: 12
  }
};

/**
 * These contracts are hidden because we don't show fxhash and rarible contracts as collection
 */
export const HIDDEN_CONTRACTS = [
  'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton',
  'KT1EfsNuqwLAWDd3o4pvfUx1CAh5GMdTrRvr',
  'KT1GtbuswcNMGhHF2TSuH1Yfaqn16do8Qtva',
  'KT1GbyoDi7H1sfXmimXpptZJuCdHMh66WS9u',
  'KT1U6EHmNxJTkvaWJ4ThczG4FSDaHC21ssvi',
  'KT18pVpRXKPY2c4U2yFEGSH3ZnhB2kL8kwXS',
  'KT1KEa8z6vWXDJrVqtMrAeDVzsvxat3kHaCE'
];

export const ADULT_ATTRIBUTE_NAME = '__nsfw_';
