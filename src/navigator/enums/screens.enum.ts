import { TokenInterface } from '../../token/interfaces/token.interface';

export enum ScreensEnum {
  Welcome = 'Welcome',
  ImportAccount = 'ImportAccount',
  SyncAccount = 'SyncAccount',
  ConfirmSync = 'ConfirmSync',
  CreateAccount = 'CreateAccount',

  /** Wallet stack **/
  Wallet = 'Wallet',
  CollectiblesHome = 'CollectiblesHome',
  TezosTokenScreen = 'TezosTokenScreen',
  TokenScreen = 'TokenScreen',
  Delegation = 'Delegation',
  ManageAssets = 'ManageAssets',
  Activity = 'Activity',
  ScanQrCode = 'ScanQrCode',

  /** DApps stack **/
  DApps = 'DApps',

  /** Swap stack **/
  Swap = 'Swap',

  /** Settings stack **/
  Settings = 'Settings',
  ManageAccounts = 'ManageAccounts',
  About = 'About',
  DAppsSettings = 'DAppsSettings',
  SecureSettings = 'SecureSettings',
  NodeSettings = 'NodeSettings',
  Debug = 'Debug'
}

export type ScreensParamList = {
  [ScreensEnum.Welcome]: undefined;
  [ScreensEnum.ImportAccount]: undefined;
  [ScreensEnum.SyncAccount]: undefined;
  [ScreensEnum.ConfirmSync]: { payload: string };
  [ScreensEnum.CreateAccount]: undefined;

  /** Wallet stack **/
  [ScreensEnum.Wallet]: undefined;
  [ScreensEnum.CollectiblesHome]: undefined;
  [ScreensEnum.TezosTokenScreen]: undefined;
  [ScreensEnum.TokenScreen]: { token: TokenInterface };
  [ScreensEnum.Delegation]: undefined;
  [ScreensEnum.ManageAssets]: undefined;
  [ScreensEnum.Activity]: undefined;
  [ScreensEnum.ScanQrCode]: undefined;

  /** DApps stack **/
  [ScreensEnum.DApps]: undefined;

  /** Swap stack **/
  [ScreensEnum.Swap]: undefined;

  /** Settings stack **/
  [ScreensEnum.Settings]: undefined;
  [ScreensEnum.ManageAccounts]: undefined;
  [ScreensEnum.About]: undefined;
  [ScreensEnum.DAppsSettings]: undefined;
  [ScreensEnum.SecureSettings]: undefined;
  [ScreensEnum.NodeSettings]: undefined;
  [ScreensEnum.Debug]: undefined;
};

export const walletStackScreens = [
  ScreensEnum.Wallet,
  ScreensEnum.CollectiblesHome,
  ScreensEnum.TezosTokenScreen,
  ScreensEnum.TokenScreen,
  ScreensEnum.Delegation,
  ScreensEnum.ManageAssets,
  ScreensEnum.Activity,
  ScreensEnum.ScanQrCode
];
export const dAppsStackScreens = [ScreensEnum.DApps];
export const swapStackScreens = [ScreensEnum.Swap];
export const settingsStackScreens = [
  ScreensEnum.Settings,
  ScreensEnum.ManageAccounts,
  ScreensEnum.About,
  ScreensEnum.DAppsSettings,
  ScreensEnum.SecureSettings,
  ScreensEnum.NodeSettings
];
