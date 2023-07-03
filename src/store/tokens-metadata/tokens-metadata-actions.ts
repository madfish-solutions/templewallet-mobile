import { createAction } from '@reduxjs/toolkit';

import { AttributeInfo } from '../../interfaces/attribute.interface';
import { TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { createActions } from '../create-actions';

export const addKnownSvg = createAction<string>('assets/ADD_KNOWN_SVG');

export const removeKnownSvg = createAction<string>('assets/REMOVE_KNOWN_SVG');

export const addTokensMetadataAction = createAction<TokenMetadataInterface[]>('assets/ADD_TOKENS_METADATA');

export const loadTokensMetadataAction = createAction<string[]>('assets/LOAD_TOKENS_METADATA');

export const loadWhitelistAction = createActions<void, Array<TokenMetadataInterface>>('assets/LOAD_WHITELIST_METADATA');

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

export const loadCollectibleAttributesActions = createActions<
  { tokenSlug: string; attributeIds: number[]; isGallery: boolean },
  { tokenSlug: string; attributesInfo: AttributeInfo[] },
  string
>('assets/LOAD_TOKEN_METADATA');
