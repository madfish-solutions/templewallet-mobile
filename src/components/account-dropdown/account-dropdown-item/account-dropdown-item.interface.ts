import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { Account } from 'src/interfaces/account.interfaces.ts';

export interface AccountDropdownItemProps {
  account: Account;
  showFullData?: boolean;
  actionIconName?: IconNameV2Enum;
  actionIconColor?: string;
  isPublicKeyHashTextDisabled?: boolean;
  isCollectibleScreen?: boolean;
}
