import { FunctionComponent } from 'react';
import { SvgProps } from 'react-native-svg';

import ArrowDownIcon from './assets/arrow-down.svg';
import ArrowUpIcon from './assets/arrow-up.svg';
import DownloadIcon from './assets/download.svg';
import EyeClosedBoldIcon from './assets/eye-closed-bold.svg';
import EyeOpenBoldIcon from './assets/eye-open-bold.svg';
import PlusSquareIcon from './assets/plus-square.svg';
import SettingsIcon from './assets/settings.svg';
import ShoppingCardIcon from './assets/shopping-card.svg';
import SoonBadgeIcon from './assets/soon-badge.svg';
import XCircleIcon from './assets/x-circle.svg';
import XtzWalletIcon from './assets/xtz-wallet.svg';
import { IconNameEnum } from './icon-name.enum';

export const iconNameMap: Record<IconNameEnum, FunctionComponent<SvgProps>> = {
  [IconNameEnum.ArrowUp]: ArrowUpIcon,
  [IconNameEnum.ArrowDown]: ArrowDownIcon,
  [IconNameEnum.Download]: DownloadIcon,
  [IconNameEnum.PlusSquare]: PlusSquareIcon,
  [IconNameEnum.ShoppingCard]: ShoppingCardIcon,
  [IconNameEnum.XCircle]: XCircleIcon,
  [IconNameEnum.EyeClosedBold]: EyeClosedBoldIcon,
  [IconNameEnum.EyeOpenBold]: EyeOpenBoldIcon,
  [IconNameEnum.XtzWallet]: XtzWalletIcon,
  [IconNameEnum.Settings]: SettingsIcon,
  [IconNameEnum.SoonBadge]: SoonBadgeIcon
};
