import { FC } from 'react';
import { SvgProps } from 'react-native-svg';

import AlarmTriangleIcon from './assets/alarm-triangle.svg';
import ArrowDownIcon from './assets/arrow-down.svg';
import ArrowLeftIcon from './assets/arrow-left.svg';
import ArrowUpIcon from './assets/arrow-up.svg';
import CartIcon from './assets/cart.svg';
import ChevronRightIcon from './assets/chevron-right.svg';
import ClockIcon from './assets/clock.svg';
import CopyIcon from './assets/copy.svg';
import DollarIcon from './assets/dollar.svg';
import DropdownDownIcon from './assets/dropdown-down.svg';
import ImportIcon from './assets/import.svg';
import InfoIcon from './assets/info.svg';
import NotificationIcon from './assets/notification.svg';
import PlusBigIcon from './assets/plus-big.svg';
import QrIcon from './assets/qr.svg';
import SearchIcon from './assets/search.svg';
import SettingsIcon from './assets/settings.svg';
import SliderIcon from './assets/slider.svg';
import UserAddIcon from './assets/user-add.svg';
import XBigIcon from './assets/x-big.svg';
import XRoundIcon from './assets/x-round.svg';
import { IconNameV2Enum } from './icon-name.enum';

export const IconNameV2Map: Record<IconNameV2Enum, FC<SvgProps>> = {
  [IconNameV2Enum.Copy]: CopyIcon,
  [IconNameV2Enum.Qr]: QrIcon,
  [IconNameV2Enum.XBig]: XBigIcon,
  [IconNameV2Enum.XRound]: XRoundIcon,
  [IconNameV2Enum.AlarmTriangle]: AlarmTriangleIcon,
  [IconNameV2Enum.Info]: InfoIcon,
  [IconNameV2Enum.ArrowLeft]: ArrowLeftIcon,
  [IconNameV2Enum.ArrowDown]: ArrowDownIcon,
  [IconNameV2Enum.ArrowUp]: ArrowUpIcon,
  [IconNameV2Enum.PlusBig]: PlusBigIcon,
  [IconNameV2Enum.ChevronRight]: ChevronRightIcon,
  [IconNameV2Enum.DropdownDown]: DropdownDownIcon,
  [IconNameV2Enum.Notification]: NotificationIcon,
  [IconNameV2Enum.Settings]: SettingsIcon,
  [IconNameV2Enum.Cart]: CartIcon,
  [IconNameV2Enum.Dollar]: DollarIcon,
  [IconNameV2Enum.Search]: SearchIcon,
  [IconNameV2Enum.Clock]: ClockIcon,
  [IconNameV2Enum.Slider]: SliderIcon,
  [IconNameV2Enum.Import]: ImportIcon,
  [IconNameV2Enum.UserAdd]: UserAddIcon
};
