import { createAction } from '@reduxjs/toolkit';

import { TokenMetadataInterface } from 'src/token/interfaces/token-metadata.interface';
import type { WhitelistTokensItem } from 'src/utils/token-metadata.utils';

import { createActions } from '../create-actions';

export const addKnownSvg = createAction<string>('assets/ADD_KNOWN_SVG');

export const removeKnownSvg = createAction<string>('assets/REMOVE_KNOWN_SVG');

export const putTokenMetadataAction = createAction<TokenMetadataInterface | nullish>('assets/ADD_TOKENS_METADATA');

/** TODO: add `ofDcpNetwork` flag to payload */
export const loadTokensMetadataActions = createActions<string[], (TokenMetadataInterface | nullish)[]>(
  'assets/LOAD_TOKENS_METADATA'
);

export const loadWhitelistAction = createActions<void, WhitelistTokensItem[]>('assets/LOAD_WHITELIST_METADATA');

export const loadScamlistAction = createActions<void, Record<string, boolean>>('assets/LOAD_SCAM_TOKEN_SLUGS');

export const loadTokenMetadataActions = createActions<
  Pick<TokenMetadataInterface, 'id' | 'address'>,
  TokenMetadataInterface,
  string
>('assets/LOAD_TOKEN_METADATA');

export const loadTokenSuggestionActions = createActions<
  Pick<TokenMetadataInterface, 'id' | 'address'>,
  TokenMetadataInterface,
  string
>('assets/LOAD_TOKEN_SUGGESTION');
