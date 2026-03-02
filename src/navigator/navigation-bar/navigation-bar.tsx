import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { isTablet } from 'react-native-device-info';
import Orientation, { useOrientationChange } from 'react-native-orientation-locker';

import { useIsAuthorisedSelector } from '../../store/wallet/wallet-selectors';
import { conditionalStyle } from '../../utils/conditional-style';
import { CurrentRouteNameContext } from '../current-route-name.context';
import { ScreensEnum } from '../enums/screens.enum';

import { NavigationBarStyles } from './navigation-bar.styles';
import { SideBar } from './side-bar/side-bar';
import { TabBar } from './tab-bar/tab-bar';

const IPAD_MINI_WIDTH = 768;

const screensWithoutTabBar = [
  ScreensEnum.ScanQrCode,
  ScreensEnum.ManualBackup,
  ScreensEnum.CloudBackup,
  ScreensEnum.NotificationsItem,
  ScreensEnum.SecurityUpdate
];

export const NavigationBar: FCWithChildren = ({ children }) => {
  const isAuthorised = useIsAuthorisedSelector();
  const currentRouteName = useContext(CurrentRouteNameContext);

  const [isShowTabletNavigation, setIsShowTabletNavigation] = useState(false);

  const isShowNavigationBar = isAuthorised && !screensWithoutTabBar.includes(currentRouteName as ScreensEnum);

  useEffect(() => void (!isTablet() && Orientation.lockToPortrait()), []);

  useOrientationChange(() => setIsShowTabletNavigation(Dimensions.get('screen').width >= IPAD_MINI_WIDTH));

  return (
    <View
      style={[
        NavigationBarStyles.container,
        conditionalStyle(isShowTabletNavigation, NavigationBarStyles.tabletContainer)
      ]}
    >
      {isShowNavigationBar && isShowTabletNavigation && <SideBar currentRouteName={currentRouteName} />}
      {children}
      {isShowNavigationBar && !isShowTabletNavigation && <TabBar currentRouteName={currentRouteName} />}
    </View>
  );
};
