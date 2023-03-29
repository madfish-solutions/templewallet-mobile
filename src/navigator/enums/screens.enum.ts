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
  Notifications = 'Notifications',
  NotificationsItem = 'NotificationsItem',

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
  AliceBob = 'AliceBob',
  Utorg = 'Utorg',

  /** Market stack **/
  Market = 'Market',

  /** Settings stack **/
  Settings = 'Settings',
  ManageAccounts = 'ManageAccounts',
  Contacts = 'Contacts',
  About = 'About',
  DAppsSettings = 'DAppsSettings',
  FiatSettings = 'FiatSettings',
  SecureSettings = 'SecureSettings',
  NodeSettings = 'NodeSettings',
  Backup = 'Backup',
  ManualBackup = 'ManualBackup',
  NotificationsSettings = 'NotificationsSettings',
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
  [ScreensEnum.Notifications]: undefined;
  [ScreensEnum.NotificationsItem]: { id: number };
  [ScreensEnum.Buy]: undefined;
  [ScreensEnum.Exolix]: undefined;
  [ScreensEnum.AliceBob]: { min: number; max: number };
  [ScreensEnum.Utorg]: { min: number; max: number; currencies: string[] };

  /** DApps stack **/
  [ScreensEnum.DApps]: undefined;
  [ScreensEnum.LiquidityBakingDapp]: undefined;

  /** Swap stack **/
  [ScreensEnum.SwapScreen]?: { inputToken?: TokenInterface; outputToken?: TokenInterface };
  [ScreensEnum.SwapSettingsScreen]: undefined;
  [ScreensEnum.SwapQuestionsScreen]: undefined;

  /** Market stack **/
  [ScreensEnum.Market]: undefined;

  /** Market stack **/
  [ScreensEnum.Market]: undefined;

  /** Settings stack **/
  [ScreensEnum.Settings]: undefined;
  [ScreensEnum.ManageAccounts]: undefined;
  [ScreensEnum.Contacts]: undefined;
  [ScreensEnum.About]: undefined;
  [ScreensEnum.DAppsSettings]: undefined;
  [ScreensEnum.FiatSettings]: undefined;
  [ScreensEnum.SecureSettings]: undefined;
  [ScreensEnum.NodeSettings]: undefined;
  [ScreensEnum.Backup]: undefined;
  [ScreensEnum.ManualBackup]: undefined;
  [ScreensEnum.NotificationsSettings]: undefined;
  [ScreensEnum.Debug]: undefined;
};

export const walletStackScreens = [
  ScreensEnum.Wallet,
  ScreensEnum.TezosTokenScreen,
  ScreensEnum.TokenScreen,
  ScreensEnum.Delegation,
  ScreensEnum.ManageAssets,
  ScreensEnum.Activity,
  ScreensEnum.ScanQrCode,
  ScreensEnum.Buy,
  ScreensEnum.Exolix,
  ScreensEnum.AliceBob,
  ScreensEnum.Notifications,
  ScreensEnum.NotificationsItem
];
export const nftStackScreens = [ScreensEnum.CollectiblesHome];
export const dAppsStackScreens = [ScreensEnum.DApps, ScreensEnum.LiquidityBakingDapp];
export const swapStackScreens = [
  ScreensEnum.SwapScreen,
  ScreensEnum.SwapSettingsScreen,
  ScreensEnum.SwapQuestionsScreen
];
export const marketStackScreens = [ScreensEnum.Market];
export const settingsStackScreens = [
  ScreensEnum.Settings,
  ScreensEnum.ManageAccounts,
  ScreensEnum.Contacts,
  ScreensEnum.About,
  ScreensEnum.DAppsSettings,
  ScreensEnum.SecureSettings,
  ScreensEnum.Backup,
  ScreensEnum.ManualBackup,
  ScreensEnum.NotificationsSettings,
  ScreensEnum.NodeSettings
];
