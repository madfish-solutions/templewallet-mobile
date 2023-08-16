import { TokenInterface } from 'src/token/interfaces/token.interface';

export enum ScreensEnum {
  Welcome = 'Welcome',
  ImportAccount = 'ImportAccount',
  SyncInstructions = 'SyncInstructions',
  ConfirmSync = 'ConfirmSync',
  CreateAccount = 'CreateAccount',
  ContinueWithCloud = 'ContinueWithCloud',

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

  /** Swap stack **/
  SwapScreen = 'SwapScreen',
  SwapSettingsScreen = 'SwapSettingsScreen',

  /** Buy stack **/
  Buy = 'Buy',
  BuyWithCreditCard = 'BuyWithCreditCard',
  Exolix = 'Exolix',

  /** Earn stack **/
  Earn = 'Earn',

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
  CloudBackup = 'CloudBackup',
  NotificationsSettings = 'NotificationsSettings',
  Debug = 'Debug',
  Blank = 'Blank'
}

export type ScreensParamList = {
  [ScreensEnum.Welcome]: undefined;
  [ScreensEnum.ImportAccount]: undefined;
  [ScreensEnum.SyncInstructions]: undefined;
  [ScreensEnum.ConfirmSync]: { payload: string };
  [ScreensEnum.CreateAccount]: { backupToCloud?: boolean; cloudBackupId?: number };
  [ScreensEnum.ContinueWithCloud]: undefined;

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
  [ScreensEnum.BuyWithCreditCard]: undefined;
  [ScreensEnum.Exolix]: undefined;

  [ScreensEnum.Earn]: undefined;

  /** DApps stack **/
  [ScreensEnum.DApps]: undefined;

  /** Swap stack **/
  [ScreensEnum.SwapScreen]?: { inputToken?: TokenInterface; outputToken?: TokenInterface };
  [ScreensEnum.SwapSettingsScreen]: undefined;

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
  [ScreensEnum.CloudBackup]: undefined;
  [ScreensEnum.NotificationsSettings]: undefined;
  [ScreensEnum.Debug]: undefined;
  [ScreensEnum.Blank]: undefined;
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
  ScreensEnum.BuyWithCreditCard,
  ScreensEnum.Earn,
  ScreensEnum.Exolix,
  ScreensEnum.Notifications,
  ScreensEnum.NotificationsItem,
  ScreensEnum.Blank
];
export const nftStackScreens = [ScreensEnum.CollectiblesHome];
export const dAppsStackScreens = [ScreensEnum.DApps];
export const swapStackScreens = [ScreensEnum.SwapScreen, ScreensEnum.SwapSettingsScreen];
export const marketStackScreens = [ScreensEnum.Market];
