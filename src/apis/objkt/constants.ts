import { getApolloConfigurableClient } from 'src/apollo/utils/get-apollo-configurable-client.util';

import { CurrencyInfo } from './types';

const OBJKT_API = 'https://data.objkt.com/v3/graphql/';

export const OBJKT_CONTRACT = 'KT1WvzYHCNBvDSdwafTHv7nJ1dWmZ8GCYuuC';

export const apolloObjktClient = getApolloConfigurableClient(OBJKT_API);

type CurrencyIdFromApi = number;

export const currencyInfoById: Record<CurrencyIdFromApi, CurrencyInfo> = {
  23: {
    symbol: 'uUSD',
    decimals: 12,
    contract: 'KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW',
    id: '0'
  },
  218: {
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
  }
};

export const ADULT_ATTRIBUTE_NAME = '__nsfw_';
