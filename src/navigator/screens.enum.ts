export enum ScreensEnum {
  Welcome = 'Welcome',
  ImportAccount = 'ImportAccount',
  CreateAccount = 'CreateAccount',
  EnterPassword = 'EnterPassword',
  ConfirmationWindow = 'ConfirmationWindow',
  Wallet = 'Wallet',
  Settings = 'Settings'
}

export type ScreensParamList = {
  [ScreensEnum.Welcome]: undefined;
  [ScreensEnum.ImportAccount]: undefined;
  [ScreensEnum.CreateAccount]: undefined;
  [ScreensEnum.EnterPassword]: undefined;
  [ScreensEnum.ConfirmationWindow]: undefined;
  [ScreensEnum.Wallet]: undefined;
  [ScreensEnum.Settings]: { userId: string };
};
