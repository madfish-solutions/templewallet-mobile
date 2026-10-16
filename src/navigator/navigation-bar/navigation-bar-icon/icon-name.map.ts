import DAppsIcon from './assets/dapps.svg';
import MarketIcon from './assets/market.svg';
import NftIcon from './assets/nft.svg';
import SwapIcon from './assets/swap.svg';
import WalletIcon from './assets/wallet.svg';
import { NavigationBarIconNameEnum } from './icon-name.enum';

export const NavigationBarIconNameMap = {
  [NavigationBarIconNameEnum.Wallet]: WalletIcon,
  [NavigationBarIconNameEnum.Nft]: NftIcon,
  [NavigationBarIconNameEnum.Swap]: SwapIcon,
  [NavigationBarIconNameEnum.DApps]: DAppsIcon,
  [NavigationBarIconNameEnum.Market]: MarketIcon
};
