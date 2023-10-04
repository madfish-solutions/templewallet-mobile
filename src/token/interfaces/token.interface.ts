import { VisibilityEnum } from '../../enums/visibility.enum';
import { AccountTokenInterface } from './account-token.interface';
import { TokenMetadataInterface, emptyTokenMetadata } from './token-metadata.interface';

export type TokenInterface = Omit<AccountTokenInterface, 'slug'> & TokenMetadataInterface;

/** @deprecated // BAD PRACTICE !!! */
export const emptyToken: TokenInterface = {
  ...emptyTokenMetadata,
  balance: '0',
  visibility: VisibilityEnum.Visible
};

/** @deprecated // BAD PRACTICE !!! */
export const emptyTezosLikeToken: TokenInterface = {
  ...emptyToken,
  decimals: 6
};
