import type { VisibilityEnum } from 'src/enums/visibility.enum';

export interface AccountTokenInterface {
  slug: string;
  balance: string;
  visibility: VisibilityEnum;

  /** @deprecated */
  isVisible?: boolean;
}
