export enum ScreensEnum {
  Welcome = 'Welcome',
  ImportAccount = 'ImportAccount',
  CreateAccount = 'CreateAccount',

  /** Wallet stack **/
  Wallet = 'Wallet',
  TezosTokenScreen = 'TezosTokenScreen',
  TokenScreen = 'TokenScreen',
  Delegation = 'Delegation',

  /** DApps stack **/
  DApps = 'DApps',

  /** Swap stack **/
  Swap = 'Swap',

  /** Settings stack **/
  Settings = 'Settings',
  ManageAccounts = 'ManageAccounts'
}

export type ScreensParamList = {
  [ScreensEnum.Welcome]: undefined;
  [ScreensEnum.ImportAccount]: undefined;
  [ScreensEnum.CreateAccount]: undefined;

  /** Wallet stack **/
  [ScreensEnum.Wallet]: undefined;
  [ScreensEnum.TezosTokenScreen]: undefined;
  [ScreensEnum.TokenScreen]: { slug: string };
  [ScreensEnum.Delegation]: undefined;

  /** DApps stack **/
  [ScreensEnum.DApps]: undefined;

  /** Swap stack **/
  [ScreensEnum.Swap]: undefined;

  /** Settings stack **/
  [ScreensEnum.Settings]: undefined;
  [ScreensEnum.ManageAccounts]: undefined;
};

export const walletStackScreens = [
  ScreensEnum.Wallet,
  ScreensEnum.TezosTokenScreen,
  ScreensEnum.TokenScreen,
  ScreensEnum.Delegation
];
export const dAppsStackScreens = [ScreensEnum.DApps];
export const swapStackScreens = [ScreensEnum.Swap];
export const settingsStackScreens = [ScreensEnum.Settings, ScreensEnum.ManageAccounts];
