import { AccountBaseInterface } from '../../../interfaces/account.interface';
import { IconNameEnum } from '../../icon/icon-name.enum';

export interface AccountDropdownItemProps {
  account?: AccountBaseInterface;
  showFullData?: boolean;
  actionIconName?: IconNameEnum;
  isPublicKeyHashTextDisabled?: boolean;
  isCollectibleScreen?: boolean;
}
