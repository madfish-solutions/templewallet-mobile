import { ScreensEnum } from 'src/navigator/enums/screens.enum';

enum TabBarButtonSelectors {
  wallet = 'Tab/Wallet',
  collectibles = 'Tab/Collectibles',
  swap = 'Tab/Swap',
  dApps = 'Tab/DApps',
  market = 'Tab/Market'
}

export type TabRoute =
  | ScreensEnum.Wallet
  | ScreensEnum.CollectiblesHome
  | ScreensEnum.SwapScreen
  | ScreensEnum.DApps
  | ScreensEnum.Market;

export const tabBarButtonTestID: Record<TabRoute, TabBarButtonSelectors> = {
  [ScreensEnum.Wallet]: TabBarButtonSelectors.wallet,
  [ScreensEnum.CollectiblesHome]: TabBarButtonSelectors.collectibles,
  [ScreensEnum.SwapScreen]: TabBarButtonSelectors.swap,
  [ScreensEnum.DApps]: TabBarButtonSelectors.dApps,
  [ScreensEnum.Market]: TabBarButtonSelectors.market
};
