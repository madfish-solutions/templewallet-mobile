import { VisibilityEnum } from 'src/enums/visibility.enum';
import { AccountTokenInterface } from 'src/token/interfaces/account-token.interface';
import { TokenMetadataInterface } from 'src/token/interfaces/token-metadata.interface';

import { UsableAccountAsset } from '../types';

export const buildUsableAccountAsset = (
  asset: AccountTokenInterface,
  metadata: TokenMetadataInterface,
  exchangeRate?: number
): UsableAccountAsset => {
  let visibility = asset.visibility;
  if (visibility === VisibilityEnum.InitiallyHidden) {
    visibility = Number(asset.balance) > 0 ? VisibilityEnum.Visible : VisibilityEnum.Hidden;
  }

  return {
    ...metadata,
    slug: asset.slug,
    visibility,
    balance: asset.balance,
    exchangeRate
  };
};
