import { VisibilityEnum } from 'src/enums/visibility.enum';

import { TokenMetadataInterface, emptyTokenMetadata } from './token-metadata.interface';

export interface TokenInterface extends TokenMetadataInterface {
  /** @deprecated Too dynamic data. Store separately */
  balance: string;
  /** @deprecated Stored as separate Record */
  exchangeRate?: number;
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
