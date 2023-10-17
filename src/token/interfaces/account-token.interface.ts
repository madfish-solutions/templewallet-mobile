import { VisibilityEnum } from 'src/enums/visibility.enum';

export interface AccountTokenInterface {
  slug: string;
  visibility: VisibilityEnum;

  /** @deprecated // Dynamic data. Gotta store separately */
  balance: string;

  /** @deprecated */
  isVisible?: boolean;
}
