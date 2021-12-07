import { WalletAccountInterface } from '../../../interfaces/wallet-account.interface';
import { IconNameEnum } from '../../icon/icon-name.enum';

export interface AccountDropdownItemProps {
  account?: WalletAccountInterface;
  showFullData?: boolean;
  actionIconName?: IconNameEnum;
}
