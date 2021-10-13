import { TokenMetadataResponse } from '../../utils/token-metadata.utils';
import { createActions } from '../create-actions';

export const loadTokenWhitelist = createActions<void, TokenMetadataResponse[], string>('swap/LOAD_TOKEN_WHITELIST');
