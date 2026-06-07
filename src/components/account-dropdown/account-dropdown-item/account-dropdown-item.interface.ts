import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { Account } from 'src/interfaces/account.interfaces.ts';

export interface AccountDropdownItemProps {
  account: Account;
  showFullData?: boolean;
  actionIconName?: IconNameEnum;
  isPublicKeyHashTextDisabled?: boolean;
  isCollectibleScreen?: boolean;
}
