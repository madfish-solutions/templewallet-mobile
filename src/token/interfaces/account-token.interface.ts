import { VisibilityEnum } from 'src/enums/visibility.enum';

export interface AccountTokenInterface {
  slug: string;
  /** @deprecated // Very dynamic data. Gotta store separately */
  balance: string;
  visibility: VisibilityEnum;

  /** @deprecated */
  isVisible?: boolean;
}
