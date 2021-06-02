import { FC } from 'react';
import { SvgProps } from 'react-native-svg';

import AlertIcon from './assets/alert.svg';
import ArrowDownIcon from './assets/arrow-down.svg';
import ArrowLeftIcon from './assets/arrow-left.svg';
import ArrowUpIcon from './assets/arrow-up.svg';
import CheckIcon from './assets/check.svg';
import ChevronRightIcon from './assets/chevron-right.svg';
import ClockIcon from './assets/clock.svg';
import CloseIcon from './assets/close.svg';
import CopyIcon from './assets/copy.svg';
import DownloadIcon from './assets/download.svg';
import EditIcon from './assets/edit.svg';
import ExternalLinkIcon from './assets/external-link.svg';
import EyeClosedBoldIcon from './assets/eye-closed-bold.svg';
import EyeOpenBoldIcon from './assets/eye-open-bold.svg';
import InfoIcon from './assets/info.svg';
import InputXCircleIcon from './assets/input-x-circle.svg';
import IosSearchIcon from './assets/ios-search.svg';
import LockIcon from './assets/lock.svg';
import LogOutIcon from './assets/log-out.svg';
import NoResultIcon from './assets/no-result.svg';
import PlusCircleIcon from './assets/plus-circle.svg';
import PlusSquareIcon from './assets/plus-square.svg';
import QrScannerIcon from './assets/qr-scanner.svg';
import SearchIcon from './assets/search.svg';
import SettingsIcon from './assets/settings.svg';
import ShareIcon from './assets/share.svg';
import ShoppingCardIcon from './assets/shopping-card.svg';
import DiscordIcon from './assets/socials/discord.svg';
import RedditIcon from './assets/socials/reddit.svg';
import TelegramIcon from './assets/socials/telegram.svg';
import TwitterIcon from './assets/socials/twitter.svg';
import YouTubeIcon from './assets/socials/you-tube.svg';
import SoonBadgeIcon from './assets/soon-badge.svg';
import TagIcon from './assets/tag.svg';
import TempleLogoWithTextIcon from './assets/temple-logo-with-text.svg';
import BlndTokenIcon from './assets/tokens/blnd.svg';
import EthTzTokenIcon from './assets/tokens/ethTz.svg';
import KUsdTokenIcon from './assets/tokens/kUsd.svg';
import NoNameTokenIcon from './assets/tokens/no-name.svg';
import StkrTokenIcon from './assets/tokens/stkr.svg';
import TzBtcTokenIcon from './assets/tokens/tzBtc.svg';
import UsdSTokenIcon from './assets/tokens/usds.svg';
import UsdTzTokenIcon from './assets/tokens/usdTz.svg';
import WXtzTokenIcon from './assets/tokens/wXtz.svg';
import XtzTokenIcon from './assets/tokens/xtz.svg';
import TrashIcon from './assets/trash.svg';
import TriangleDownIcon from './assets/triangle-down.svg';
import XCircleIcon from './assets/x-circle.svg';
import XtzWalletIcon from './assets/xtz-wallet.svg';
import { IconNameEnum } from './icon-name.enum';

export const iconNameMap: Record<IconNameEnum, FC<SvgProps>> = {
  [IconNameEnum.ArrowUp]: ArrowUpIcon,
  [IconNameEnum.ArrowDown]: ArrowDownIcon,
  [IconNameEnum.ArrowLeft]: ArrowLeftIcon,
  [IconNameEnum.Download]: DownloadIcon,
  [IconNameEnum.PlusSquare]: PlusSquareIcon,
  [IconNameEnum.PlusCircle]: PlusCircleIcon,
  [IconNameEnum.ShoppingCard]: ShoppingCardIcon,
  [IconNameEnum.InputXCircle]: InputXCircleIcon,
  [IconNameEnum.XCircle]: XCircleIcon,
  [IconNameEnum.EyeClosedBold]: EyeClosedBoldIcon,
  [IconNameEnum.EyeOpenBold]: EyeOpenBoldIcon,
  [IconNameEnum.XtzWallet]: XtzWalletIcon,
  [IconNameEnum.Settings]: SettingsIcon,
  [IconNameEnum.SoonBadge]: SoonBadgeIcon,
  [IconNameEnum.Close]: CloseIcon,
  [IconNameEnum.XtzToken]: XtzTokenIcon,
  [IconNameEnum.TzBtcToken]: TzBtcTokenIcon,
  [IconNameEnum.UsdTzToken]: UsdTzTokenIcon,
  [IconNameEnum.EthTzToken]: EthTzTokenIcon,
  [IconNameEnum.KUsdToken]: KUsdTokenIcon,
  [IconNameEnum.WXtzToken]: WXtzTokenIcon,
  [IconNameEnum.UsdSToken]: UsdSTokenIcon,
  [IconNameEnum.BlndToken]: BlndTokenIcon,
  [IconNameEnum.StkrToken]: StkrTokenIcon,
  [IconNameEnum.NoNameToken]: NoNameTokenIcon,
  [IconNameEnum.Share]: ShareIcon,
  [IconNameEnum.Copy]: CopyIcon,
  [IconNameEnum.Tag]: TagIcon,
  [IconNameEnum.QrScanner]: QrScannerIcon,
  [IconNameEnum.TriangleDown]: TriangleDownIcon,
  [IconNameEnum.Check]: CheckIcon,
  [IconNameEnum.Lock]: LockIcon,
  [IconNameEnum.Clock]: ClockIcon,
  [IconNameEnum.Info]: InfoIcon,
  [IconNameEnum.ChevronRight]: ChevronRightIcon,
  [IconNameEnum.NoResult]: NoResultIcon,
  [IconNameEnum.TempleLogoWithText]: TempleLogoWithTextIcon,
  [IconNameEnum.Telegram]: TelegramIcon,
  [IconNameEnum.Discord]: DiscordIcon,
  [IconNameEnum.Twitter]: TwitterIcon,
  [IconNameEnum.YouTube]: YouTubeIcon,
  [IconNameEnum.Reddit]: RedditIcon,
  [IconNameEnum.ExternalLink]: ExternalLinkIcon,
  [IconNameEnum.IosSearch]: IosSearchIcon,
  [IconNameEnum.Search]: SearchIcon,
  [IconNameEnum.Alert]: AlertIcon,
  [IconNameEnum.Edit]: EditIcon,
  [IconNameEnum.Trash]: TrashIcon,
  [IconNameEnum.LogOut]: LogOutIcon
};
