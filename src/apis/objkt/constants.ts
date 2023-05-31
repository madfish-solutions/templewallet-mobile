import { getApolloConfigurableClient } from '../../apollo/utils/get-apollo-configurable-client.util';

const OBJKT_API = 'https://data.objkt.com/v3/graphql/';

export const apolloObjktClient = getApolloConfigurableClient(OBJKT_API);

export const ADULT_ATTRIBUTE_NAME = '__nsfw_';
