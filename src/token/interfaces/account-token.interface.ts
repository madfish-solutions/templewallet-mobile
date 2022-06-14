import { VisibilityEnum } from '../../enums/visibility.enum';

export interface AccountTokenInterface {
  slug: string;
  balance: string;
  visibility: VisibilityEnum;
  //remove after migration to visibility
  isVisible?: boolean;
}
