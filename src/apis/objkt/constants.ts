import { getApolloConfigurableClient } from 'src/apollo/utils/get-apollo-configurable-client.util';

import { CurrencyInfo } from './types';

const OBJKT_API = 'https://data.objkt.com/v3/graphql/';

export const OBJKT_CONTRACT = 'KT1WvzYHCNBvDSdwafTHv7nJ1dWmZ8GCYuuC';
const FXHASH_CONTRACT = 'KT1M1NyU9X4usEimt2f3kDaijZnDMNBu42Ja';

export const SUPPORTED_CONTRACTS = [OBJKT_CONTRACT, FXHASH_CONTRACT];

export const apolloObjktClient = getApolloConfigurableClient(OBJKT_API);

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

type CurrencyIdFromApi = number;

export const currencyInfoById: Record<CurrencyIdFromApi, CurrencyInfo> = {
  2537: {
    symbol: 'uUSD',
    decimals: 12,
    contract: 'KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW',
    id: '0'
  },
  2557: {
    symbol: 'USDtz',
    decimals: 6,
    contract: 'KT1LN4LPSqTMS7Sd2CJw4bbDGRkMv2t68Fy9',
    id: '0'
  },
  1: {
    symbol: 'TEZ',
    decimals: 6,
    contract: null,
    id: null
  },
  4: {
    symbol: 'oXTZ',
    decimals: 6,
    contract: 'KT1TjnZYs5CGLbmV6yuW169P8Pnr9BiVwwjz',
    id: '0'
  },
  3: {
    symbol: 'USDtz',
    decimals: 6,
    contract: 'KT1LN4LPSqTMS7Sd2CJw4bbDGRkMv2t68Fy9',
    id: '0'
  }
};

export const ADULT_ATTRIBUTE_NAME = '__nsfw_';

export const TECHNICAL_ATTRIBUTE_NAME = '__hazards_';

export const HIDDEN_ATTRIBUTES_NAME = [ADULT_ATTRIBUTE_NAME, TECHNICAL_ATTRIBUTE_NAME];

export const PAGINATION_STEP_FA = 500;

export const PAGINATION_STEP_GALLERY = 15;
