import { TEZ_TOKEN_METADATA } from '../token/data/tokens-metadata';
import { AssetMetadataInterface } from '../token/interfaces/token-metadata.interface';
import { getTokenSlug } from '../token/utils/token.utils';

export const getExchangeRateKey = (token: AssetMetadataInterface) =>
  token.symbol === TEZ_TOKEN_METADATA.symbol ? TEZ_TOKEN_METADATA.name : getTokenSlug(token);
