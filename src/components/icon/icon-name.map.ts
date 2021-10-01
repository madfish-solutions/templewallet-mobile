import { FC } from 'react';
import { SvgProps } from 'react-native-svg';

import AlertShield from './assets/alert-shield.svg';
import AlertIcon from './assets/alert.svg';
import ArrowDownIcon from './assets/arrow-down.svg';
import ArrowLeftIcon from './assets/arrow-left.svg';
import ArrowRightIcon from './assets/arrow-right.svg';
import ArrowUpIcon from './assets/arrow-up.svg';
import BookOpenIcon from './assets/book-open.svg';
import CheckIcon from './assets/check.svg';
import ChevronRightIcon from './assets/chevron-right.svg';
import ClipboardIcon from './assets/clipboard.svg';
import ClockIcon from './assets/clock.svg';
import CloseIcon from './assets/close.svg';
import CopyIcon from './assets/copy.svg';
import DealIcon from './assets/deal.svg';
import DiezIcon from './assets/diez.svg';
import DownloadCloudIcon from './assets/download-cloud.svg';
import DownloadIcon from './assets/download.svg';
import EditIcon from './assets/edit.svg';
import ExternalLinkIcon from './assets/external-link.svg';
import EyeClosedBoldIcon from './assets/eye-closed-bold.svg';
import EyeOpenBoldIcon from './assets/eye-open-bold.svg';
import FaceIdIcon from './assets/face-id.svg';
import GHighIcon from './assets/g-high.svg';
import GLowIcon from './assets/g-low.svg';
import GMidIcon from './assets/g-mid.svg';
import GearIcon from './assets/gear.svg';
import GlobeIcon from './assets/globe.svg';
import HummerIcon from './assets/hummer.svg';
import InfoIcon from './assets/info.svg';
import InputXCircleIcon from './assets/input-x-circle.svg';
import IosSearchIcon from './assets/ios-search.svg';
import LinkIcon from './assets/link.svg';
import LockIcon from './assets/lock.svg';
import LogOutIcon from './assets/log-out.svg';
import NavigationIcon from './assets/navigation.svg';
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
import SuccessIcon from './assets/success.svg';
import TagIcon from './assets/tag.svg';
import TempleLogoWithTextIcon from './assets/temple-logo-with-text.svg';
import TempleLogoIcon from './assets/temple-logo.svg';
import TerminalIcon from './assets/terminal.svg';
import TezWalletIcon from './assets/tez-wallet.svg';
import BlndTokenIcon from './assets/tokens/blnd.svg';
import EthTzTokenIcon from './assets/tokens/ethTz.svg';
import KUsdTokenIcon from './assets/tokens/kUsd.svg';
import NoNameTokenIcon from './assets/tokens/no-name.svg';
import StkrTokenIcon from './assets/tokens/stkr.svg';
import TezTokenIcon from './assets/tokens/tez.svg';
import TzBtcTokenIcon from './assets/tokens/tzBtc.svg';
import UsdSTokenIcon from './assets/tokens/usds.svg';
import UsdTzTokenIcon from './assets/tokens/usdTz.svg';
import WXtzTokenIcon from './assets/tokens/wXtz.svg';
import TouchIdIcon from './assets/touch-id.svg';
import TrashIcon from './assets/trash.svg';
import TriangleDownIcon from './assets/triangle-down.svg';
import XCircleIcon from './assets/x-circle.svg';
import XSearchIcon from './assets/x-search.svg';
import XIcon from './assets/x.svg';
import { IconNameEnum } from './icon-name.enum';

export const iconNameMap: Record<IconNameEnum, FC<SvgProps>> = {
  [IconNameEnum.ArrowUp]: ArrowUpIcon,
  [IconNameEnum.ArrowDown]: ArrowDownIcon,
  [IconNameEnum.ArrowRight]: ArrowRightIcon,
  [IconNameEnum.BookOpen]: BookOpenIcon,
  [IconNameEnum.Terminal]: TerminalIcon,
  [IconNameEnum.ArrowLeft]: ArrowLeftIcon,
  [IconNameEnum.Download]: DownloadIcon,
  [IconNameEnum.Diez]: DiezIcon,
  [IconNameEnum.FaceId]: FaceIdIcon,
  [IconNameEnum.GLow]: GLowIcon,
  [IconNameEnum.GMid]: GMidIcon,
  [IconNameEnum.GHigh]: GHighIcon,
  [IconNameEnum.Globe]: GlobeIcon,
  [IconNameEnum.DownloadCloud]: DownloadCloudIcon,
  [IconNameEnum.PlusSquare]: PlusSquareIcon,
  [IconNameEnum.PlusCircle]: PlusCircleIcon,
  [IconNameEnum.ShoppingCard]: ShoppingCardIcon,
  [IconNameEnum.InputXCircle]: InputXCircleIcon,
  [IconNameEnum.X]: XIcon,
  [IconNameEnum.XCircle]: XCircleIcon,
  [IconNameEnum.EyeClosedBold]: EyeClosedBoldIcon,
  [IconNameEnum.EyeOpenBold]: EyeOpenBoldIcon,
  [IconNameEnum.TezWallet]: TezWalletIcon,
  [IconNameEnum.Settings]: SettingsIcon,
  [IconNameEnum.SoonBadge]: SoonBadgeIcon,
  [IconNameEnum.Close]: CloseIcon,
  [IconNameEnum.TezToken]: TezTokenIcon,
  [IconNameEnum.TzBtcToken]: TzBtcTokenIcon,
  /** TODO: delete this before release */
  [IconNameEnum.UsdTzToken]: UsdTzTokenIcon,
  [IconNameEnum.EthTzToken]: EthTzTokenIcon,
  [IconNameEnum.KUsdToken]: KUsdTokenIcon,
  [IconNameEnum.WXtzToken]: WXtzTokenIcon,
  [IconNameEnum.UsdSToken]: UsdSTokenIcon,
  [IconNameEnum.BlndToken]: BlndTokenIcon,
  [IconNameEnum.StkrToken]: StkrTokenIcon,
  /** deprecated icons **/
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
  [IconNameEnum.TempleLogo]: TempleLogoIcon,
  [IconNameEnum.TempleLogoWithText]: TempleLogoWithTextIcon,
  [IconNameEnum.Telegram]: TelegramIcon,
  [IconNameEnum.Discord]: DiscordIcon,
  [IconNameEnum.Twitter]: TwitterIcon,
  [IconNameEnum.YouTube]: YouTubeIcon,
  [IconNameEnum.Reddit]: RedditIcon,
  [IconNameEnum.ExternalLink]: ExternalLinkIcon,
  [IconNameEnum.IosSearch]: IosSearchIcon,
  [IconNameEnum.Search]: SearchIcon,
  [IconNameEnum.XSearch]: XSearchIcon,
  [IconNameEnum.Alert]: AlertIcon,
  [IconNameEnum.Edit]: EditIcon,
  [IconNameEnum.TouchId]: TouchIdIcon,
  [IconNameEnum.Trash]: TrashIcon,
  [IconNameEnum.LogOut]: LogOutIcon,
  [IconNameEnum.Clipboard]: ClipboardIcon,
  [IconNameEnum.Deal]: DealIcon,
  [IconNameEnum.Gear]: GearIcon,
  [IconNameEnum.Link]: LinkIcon,
  [IconNameEnum.AlertShield]: AlertShield,
  [IconNameEnum.Success]: SuccessIcon,
  [IconNameEnum.Navigation]: NavigationIcon,
  [IconNameEnum.Hummer]: HummerIcon
};
