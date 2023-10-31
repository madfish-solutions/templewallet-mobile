import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { ScreensEnum, ScreensParamList } from 'src/navigator/enums/screens.enum';

export interface NavigationBarButton {
  label: string;
  iconName: IconNameEnum;
  iconWidth: number;
  routeName:
    | ScreensEnum.Wallet
    | ScreensEnum.DApps
    | ScreensEnum.SwapScreen
    | ScreensEnum.Market
    | ScreensEnum.CollectiblesHome;
  focused: boolean;
  disabled?: boolean;
  showNotificationDot?: boolean;
  swapScreenParams?: ScreensParamList[ScreensEnum.SwapScreen];
  disabledOnPress?: EmptyFn;
}
