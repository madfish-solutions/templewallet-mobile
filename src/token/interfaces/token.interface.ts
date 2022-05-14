import { AccountTokenInterface } from './account-token.interface';
import { emptyTokenMetadata, TokenMetadataInterface } from './token-metadata.interface';

export type TokenInterface = Omit<AccountTokenInterface, 'slug'> & TokenMetadataInterface;

export type TokenPreviewType = Omit<TokenInterface, 'isVisible' | 'balance'>;

export const emptyToken: TokenInterface = {
  ...emptyTokenMetadata,
  balance: '0',
  isVisible: true
};
