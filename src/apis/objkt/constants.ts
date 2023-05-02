import { getApolloConfigurableClient } from 'src/apollo/utils/get-apollo-configurable-client.util';

const OBJKT_API = 'https://data.objkt.com/v3/graphql/';

export const apolloObjktClient = getApolloConfigurableClient(OBJKT_API);
