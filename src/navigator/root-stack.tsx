import { NavigationContainerRef } from '@react-navigation/core';
import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import React, { useRef, useState } from 'react';
import { Text } from 'react-native';

import { CurrentRouteNameContext } from './current-route-name.context';
import { MainStackScreen } from './main-stack';
import { ScreensEnum } from './screens.enum';

const RootStack = createStackNavigator();

const dummyModal = () => <Text>hii</Text>;

export const RootStackScreen = () => {
  const navigationRef = useRef<NavigationContainerRef>(null);
  const [currentRouteName, setCurrentRouteName] = useState<ScreensEnum>(ScreensEnum.Welcome);

  const handleNavigationContainerStateChange = () =>
    setCurrentRouteName(navigationRef.current?.getCurrentRoute()?.name as ScreensEnum);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={handleNavigationContainerStateChange}
      onStateChange={handleNavigationContainerStateChange}>
      <CurrentRouteNameContext.Provider value={currentRouteName}>
        <RootStack.Navigator
          mode="modal"
          screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS }}>
          <RootStack.Screen name="Main" component={MainStackScreen} options={{ headerShown: false }} />
          <RootStack.Screen name="MyModal" component={dummyModal} />
        </RootStack.Navigator>
      </CurrentRouteNameContext.Provider>
    </NavigationContainer>
  );
};
