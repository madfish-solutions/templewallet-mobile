import { getApolloConfigurableClient } from 'src/apollo/utils/get-apollo-configurable-client.util';

import { CurrencyInfo } from './types';

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
  }
};
