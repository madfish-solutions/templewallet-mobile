import { VisibilityEnum } from 'src/enums/visibility.enum';
import { AccountTokenInterface } from 'src/token/interfaces/account-token.interface';
import { TokenMetadataInterface } from 'src/token/interfaces/token-metadata.interface';
import { TokenInterface } from 'src/token/interfaces/token.interface';

export interface UsableAccountAsset extends TokenInterface {
  slug: string;
}

export const buildUsableAccountAsset = (
  asset: AccountTokenInterface,
  metadata: TokenMetadataInterface
): UsableAccountAsset => {
  let visibility = asset.visibility;
  if (visibility === VisibilityEnum.InitiallyHidden && Number(asset.balance) > 0) {
    visibility = VisibilityEnum.Visible;
  }

  return {
    slug: asset.slug,
    visibility,
    balance: asset.balance,
    ...metadata
  };
};
