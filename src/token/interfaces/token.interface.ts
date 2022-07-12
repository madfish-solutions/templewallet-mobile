import { VisibilityEnum } from '../../enums/visibility.enum';
import { AccountTokenInterface } from './account-token.interface';
import { emptyTokenMetadata, TokenMetadataInterface } from './token-metadata.interface';

export type TokenInterface = Omit<AccountTokenInterface, 'slug'> & TokenMetadataInterface;

export const emptyToken: TokenInterface = {
  ...emptyTokenMetadata,
  balance: '0',
  visibility: VisibilityEnum.Visible
};

export const emptyTezosLikeToken: TokenInterface = {
  ...emptyToken,
  decimals: 6
};
