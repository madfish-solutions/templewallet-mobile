import { getApolloConfigurableClient } from 'src/apollo/utils/get-apollo-configurable-client.util';

const OBJKT_API = 'https://data.objkt.com/v3/graphql/';

export const OBJKT_CONTRACT = 'KT1WvzYHCNBvDSdwafTHv7nJ1dWmZ8GCYuuC';

export const apolloObjktClient = getApolloConfigurableClient(OBJKT_API);
