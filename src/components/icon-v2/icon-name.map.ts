import { FC } from 'react';
import { SvgProps } from 'react-native-svg';

import AlarmTriangleIcon from './assets/alarm-triangle.svg';
import ArrowDownIcon from './assets/arrow-down.svg';
import ArrowLeftIcon from './assets/arrow-left.svg';
import ArrowUpIcon from './assets/arrow-up.svg';
import CartIcon from './assets/cart.svg';
import CheckboxCheckedFillIcon from './assets/checkbox-checked-fill.svg';
import CheckboxCheckedIcon from './assets/checkbox-checked.svg';
import CheckboxEmptyIcon from './assets/checkbox-empty.svg';
import ChevronRightIcon from './assets/chevron-right.svg';
import ClockIcon from './assets/clock.svg';
import CopyIcon from './assets/copy.svg';
import CubeIcon from './assets/cube.svg';
import DocumentGearIcon from './assets/document-gear.svg';
import DocumentsIcon from './assets/documents.svg';
import DollarIcon from './assets/dollar.svg';
import DropdownDownIcon from './assets/dropdown-down.svg';
import EarthIcon from './assets/earth.svg';
import ImportIcon from './assets/import.svg';
import IncomeIcon from './assets/income.svg';
import InfoFillIcon from './assets/info-fill.svg';
import InfoIcon from './assets/info.svg';
import LockOpenIcon from './assets/lock-open.svg';
import LogoutIcon from './assets/logout.svg';
import NotificationIcon from './assets/notification.svg';
import OkIcon from './assets/ok.svg';
import OutLinkIcon from './assets/out-link.svg';
import PlusBigIcon from './assets/plus-big.svg';
import QrIcon from './assets/qr.svg';
import ScamInfoIcon from './assets/scam-info.svg';
import SearchIcon from './assets/search.svg';
import SendIcon from './assets/send.svg';
import SettingsIcon from './assets/settings.svg';
import ShareIcon from './assets/share.svg';
import ShieldIcon from './assets/shield.svg';
import SliderIcon from './assets/slider.svg';
import SwapArrowIcon from './assets/swap-arrow.svg';
import TrashIcon from './assets/trash.svg';
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
  [IconNameV2Enum.InfoFill]: InfoFillIcon,
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
  [IconNameV2Enum.UserAdd]: UserAddIcon,
  [IconNameV2Enum.Trash]: TrashIcon,
  [IconNameV2Enum.CheckboxEmpty]: CheckboxEmptyIcon,
  [IconNameV2Enum.CheckboxChecked]: CheckboxCheckedIcon,
  [IconNameV2Enum.CheckboxCheckedFill]: CheckboxCheckedFillIcon,
  [IconNameV2Enum.Share]: ShareIcon,
  [IconNameV2Enum.Logout]: LogoutIcon,
  [IconNameV2Enum.Earth]: EarthIcon,
  [IconNameV2Enum.Send]: SendIcon,
  [IconNameV2Enum.Income]: IncomeIcon,
  [IconNameV2Enum.Documents]: DocumentsIcon,
  [IconNameV2Enum.Ok]: OkIcon,
  [IconNameV2Enum.OutLink]: OutLinkIcon,
  [IconNameV2Enum.Shield]: ShieldIcon,
  [IconNameV2Enum.ScamInfo]: ScamInfoIcon,
  [IconNameV2Enum.SwapArrow]: SwapArrowIcon,
  [IconNameV2Enum.LockOpen]: LockOpenIcon,
  [IconNameV2Enum.Cube]: CubeIcon,
  [IconNameV2Enum.DocumentGear]: DocumentGearIcon
};
