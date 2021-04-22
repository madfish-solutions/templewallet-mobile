export enum ScreensEnum {
  Welcome = 'Welcome',
  ImportAccount = 'ImportAccount',
  CreateAccount = 'CreateAccount',
  EnterPassword = 'EnterPassword',
  ConfirmationWindow = 'ConfirmationWindow',
  Wallet = 'Wallet',
  Settings = 'Settings',
  CreateHdAccount = 'CreateHdAccount'
}

export type WalletStackScreensParamList = {
  [ScreensEnum.Wallet]: undefined;
};

export type SettingsStackScreensParamList = {
  [ScreensEnum.Settings]: { userId: string };
  [ScreensEnum.CreateHdAccount]: undefined;
};

export type TabScreensParamList = WalletStackScreensParamList & SettingsStackScreensParamList;

export type ScreensParamList = {
  [ScreensEnum.Welcome]: undefined;
  [ScreensEnum.ImportAccount]: undefined;
  [ScreensEnum.CreateAccount]: undefined;
  [ScreensEnum.EnterPassword]: undefined;
  [ScreensEnum.ConfirmationWindow]: undefined;
} & TabScreensParamList;
