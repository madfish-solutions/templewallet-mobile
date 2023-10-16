import { VisibilityEnum } from '../../enums/visibility.enum';
import { TokenMetadataInterface, emptyTokenMetadata } from './token-metadata.interface';

export interface TokenInterface extends TokenMetadataInterface {
  balance: string;
  visibility: VisibilityEnum;
}

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
