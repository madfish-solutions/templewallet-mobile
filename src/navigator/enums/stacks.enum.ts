import { ScreensEnum, ScreensParamList } from './screens.enum';

export enum StacksEnum {
  MainStack = 'MainStack'
}

type MainStackParamsPart<T extends ScreensEnum> = undefined extends ScreensParamList[T]
  ? { screen: T; params?: ScreensParamList[T] }
  : { screen: T; params: ScreensParamList[T] };

export type MainStackParams =
  | MainStackParamsPart<ScreensEnum.Welcome>
  | MainStackParamsPart<ScreensEnum.CreateAccount>
  | MainStackParamsPart<ScreensEnum.ContinueWithCloud>
  | MainStackParamsPart<ScreensEnum.SecurityUpdate>
  | MainStackParamsPart<ScreensEnum.Wallet>
  | MainStackParamsPart<ScreensEnum.CollectiblesHome>
  | MainStackParamsPart<ScreensEnum.TezosTokenScreen>
  | MainStackParamsPart<ScreensEnum.TokenScreen>
  | MainStackParamsPart<ScreensEnum.TokenInfo>
  | MainStackParamsPart<ScreensEnum.Delegation>
  | MainStackParamsPart<ScreensEnum.ManageAssets>
  | MainStackParamsPart<ScreensEnum.Activity>
  | MainStackParamsPart<ScreensEnum.ScanQrCode>
  | MainStackParamsPart<ScreensEnum.Notifications>
  | MainStackParamsPart<ScreensEnum.NotificationsItem>
  | MainStackParamsPart<ScreensEnum.Collection>
  | MainStackParamsPart<ScreensEnum.DApps>
  | MainStackParamsPart<ScreensEnum.SwapScreen>
  | MainStackParamsPart<ScreensEnum.SwapSettingsScreen>
  | MainStackParamsPart<ScreensEnum.Buy>
  | MainStackParamsPart<ScreensEnum.BuyWithCreditCard>
  | MainStackParamsPart<ScreensEnum.Exolix>
  | MainStackParamsPart<ScreensEnum.Earn>
  | MainStackParamsPart<ScreensEnum.Farming>
  | MainStackParamsPart<ScreensEnum.Savings>
  | MainStackParamsPart<ScreensEnum.Market>
  | MainStackParamsPart<ScreensEnum.Settings>
  | MainStackParamsPart<ScreensEnum.ManageAccounts>
  | MainStackParamsPart<ScreensEnum.Contacts>
  | MainStackParamsPart<ScreensEnum.About>
  | MainStackParamsPart<ScreensEnum.DAppsSettings>
  | MainStackParamsPart<ScreensEnum.FiatSettings>
  | MainStackParamsPart<ScreensEnum.SecureSettings>
  | MainStackParamsPart<ScreensEnum.NodeSettings>
  | MainStackParamsPart<ScreensEnum.Backup>
  | MainStackParamsPart<ScreensEnum.ManualBackup>
  | MainStackParamsPart<ScreensEnum.CloudBackup>
  | MainStackParamsPart<ScreensEnum.NotificationsSettings>
  | MainStackParamsPart<ScreensEnum.Debug>
  | MainStackParamsPart<ScreensEnum.Blank>;

export type NestedNavigationStacksParamList = {
  [StacksEnum.MainStack]: MainStackParams | undefined;
};

export type StacksParamList = {
  [StacksEnum.MainStack]: undefined;
};
