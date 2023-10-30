import { VisibilityEnum } from 'src/enums/visibility.enum';
import type { TokenInterface } from 'src/token/interfaces/token.interface';

export interface UsableAccountAsset extends TokenInterface {
  slug: string;
  visibility: VisibilityEnum.Visible | VisibilityEnum.Hidden;
}

export interface AssetMediaURIs {
  thumbnailUri?: string;
  displayUri?: string;
  artifactUri?: string;
}
