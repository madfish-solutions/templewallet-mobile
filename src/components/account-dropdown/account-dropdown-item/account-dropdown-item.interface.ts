import { AddressBookItem } from 'src/interfaces/account.interfaces';
import { AccountForChain } from 'src/utils/account.utils';

import { IconNameEnum } from '../../icon/icon-name.enum';

export interface AccountDropdownItemProps {
  account?: AddressBookItem | AccountForChain;
  showFullData?: boolean;
  actionIconName?: IconNameEnum;
  isPublicKeyHashTextDisabled?: boolean;
  isCollectibleScreen?: boolean;
}

export type AccountDropdownTriggerItemProps = AccountDropdownItemProps;

export interface AccountDropdownListItemProps {
  account?: AddressBookItem;
}
