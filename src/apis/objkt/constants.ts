import { getApolloConfigurableClient } from '../../apollo/utils/get-apollo-configurable-client.util';

const OBJKT_API = 'https://data.objkt.com/v3/graphql/';

export const apolloObjktClient = getApolloConfigurableClient(OBJKT_API);

export const ADULT_ATTRIBUTE_NAME = '__nsfw_';

export const ADULT_CONTENT_TAGS = [
  'sexy',
  'sex',
  'nude',
  'lingerie',
  'naked',
  'breasts',
  'womeninart',
  'femail',
  'erotic',
  'nudeart',
  'boob',
  'nsfw'
];
