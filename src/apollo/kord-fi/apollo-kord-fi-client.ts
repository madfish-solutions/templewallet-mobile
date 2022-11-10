import { getApolloConfigurableClient } from '../utils/get-apollo-configurable-client.util';

const KORD_FI_API = 'https://back-mainnet.kord.fi/v1/graphql';

export const apolloKordFiClient = getApolloConfigurableClient(KORD_FI_API);
