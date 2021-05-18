import { AccountTokenInterface } from './account-token.interface';
import { emptyTokenMetadataInterface, TokenMetadataInterface } from './token-metadata.interface';

export type TokenInterface = Omit<AccountTokenInterface, 'slug'> & TokenMetadataInterface;

export const emptyToken: TokenInterface = {
  ...emptyTokenMetadataInterface,
  balance: '0',
  isShown: true
};
