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
  CreateHdAccount = 'CreateHdAccount',
  ManageAccounts = 'ManageAccounts'
}

export const walletStackScreens = [
  ScreensEnum.Wallet,
  ScreensEnum.TezosTokenScreen,
  ScreensEnum.TokenScreen,
  ScreensEnum.Delegation
];
export const dAppsStackScreens = [ScreensEnum.DApps];
export const swapStackScreens = [ScreensEnum.Swap];
export const settingsStackScreens = [ScreensEnum.Settings, ScreensEnum.CreateHdAccount, ScreensEnum.ManageAccounts];

export type WalletStackScreensParamList = {
  [ScreensEnum.Wallet]: undefined;
  [ScreensEnum.TezosTokenScreen]: undefined;
  [ScreensEnum.TokenScreen]: { slug: string };
  [ScreensEnum.Delegation]: undefined;
};

export type DAppsStackScreensParamList = {
  [ScreensEnum.DApps]: undefined;
};

export type SwapStackScreensParamList = {
  [ScreensEnum.Swap]: undefined;
};

export type SettingsStackScreensParamList = {
  [ScreensEnum.Settings]: undefined;
  [ScreensEnum.CreateHdAccount]: undefined;
  [ScreensEnum.ManageAccounts]: undefined;
};

export type TabScreensParamList = WalletStackScreensParamList &
  DAppsStackScreensParamList &
  SwapStackScreensParamList &
  SettingsStackScreensParamList;

export type ScreensParamList = {
  [ScreensEnum.Welcome]: undefined;
  [ScreensEnum.ImportAccount]: undefined;
  [ScreensEnum.CreateAccount]: undefined;
} & TabScreensParamList;
