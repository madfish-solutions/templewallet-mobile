import { TokenInterface } from '../../token/interfaces/token.interface';

export enum ScreensEnum {
  Welcome = 'Welcome',
  ImportAccount = 'ImportAccount',
  SyncInstructions = 'SyncInstructions',
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
  LiquidityBakingDapp = 'LiquidityBakingDapp',

  /** Swap stack **/
  SwapScreen = 'SwapScreen',
  SwapSettingsScreen = 'SwapSettingsScreen',
  SwapQuestionsScreen = 'SwapQuestionsScreen',

  /** Buy stack **/
  Buy = 'Buy',
  Exolix = 'Exolix',

  /** Settings stack **/
  Settings = 'Settings',
  ManageAccounts = 'ManageAccounts',
  About = 'About',
  DAppsSettings = 'DAppsSettings',
  FiatSettings = 'FiatSettings',
  SecureSettings = 'SecureSettings',
  NodeSettings = 'NodeSettings',
  Debug = 'Debug'
}

export type ScreensParamList = {
  [ScreensEnum.Welcome]: undefined;
  [ScreensEnum.ImportAccount]: undefined;
  [ScreensEnum.SyncInstructions]: undefined;
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
  [ScreensEnum.LiquidityBakingDapp]: undefined;

  /** Swap stack **/
  [ScreensEnum.SwapScreen]: { inputToken?: TokenInterface };
  [ScreensEnum.SwapSettingsScreen]: undefined;
  [ScreensEnum.SwapQuestionsScreen]: undefined;

  /** Buy stack **/
  [ScreensEnum.Buy]: undefined;
  [ScreensEnum.Exolix]: undefined;

  /** Settings stack **/
  [ScreensEnum.Settings]: undefined;
  [ScreensEnum.ManageAccounts]: undefined;
  [ScreensEnum.About]: undefined;
  [ScreensEnum.DAppsSettings]: undefined;
  [ScreensEnum.FiatSettings]: undefined;
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
  ScreensEnum.ScanQrCode,
  ScreensEnum.Buy,
  ScreensEnum.Exolix
];
export const dAppsStackScreens = [ScreensEnum.DApps, ScreensEnum.LiquidityBakingDapp];
export const swapStackScreens = [
  ScreensEnum.SwapScreen,
  ScreensEnum.SwapSettingsScreen,
  ScreensEnum.SwapQuestionsScreen
];
export const settingsStackScreens = [
  ScreensEnum.Settings,
  ScreensEnum.ManageAccounts,
  ScreensEnum.About,
  ScreensEnum.DAppsSettings,
  ScreensEnum.SecureSettings,
  ScreensEnum.NodeSettings
];
