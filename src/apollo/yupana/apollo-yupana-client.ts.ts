import { getApolloConfigurableClient } from '../utils/get-apollo-configurable-client.util';

const YUPANA_API = 'https://mainnet-api.yupana.finance/v1/graphql/';

export const apolloYupanaClient = getApolloConfigurableClient(YUPANA_API);
