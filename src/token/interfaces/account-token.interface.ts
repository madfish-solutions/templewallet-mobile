import type { VisibilityEnum } from 'src/enums/visibility.enum';

export interface AccountTokenInterface {
  slug: string;
  visibility: VisibilityEnum;
  /** `true` if added by the user; preserved across balance refreshes and exempt from zero-balance filtering */
  manual?: boolean;

  /** @deprecated // Dynamic data. Gotta store separately */
  balance: string;

  /** @deprecated */
  isVisible?: boolean;
}
