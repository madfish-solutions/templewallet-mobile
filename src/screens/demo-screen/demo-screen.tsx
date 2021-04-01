import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  useColorScheme
} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';

import TempleLogo from '../../assets/temple-logo.svg';
import { step } from '../../config/styles';
import { DemoScreenStyles } from './demo-screen.styles';

const ANIMATION_MIN_VALUE = 0;
const ANIMATION_MAX_VALUE = 1;

export const DemoScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const animatedValue = useRef(new Animated.Value(ANIMATION_MIN_VALUE)).current;
  const [toggle, setToggle] = useState(false);

  useEffect(() => void RNBootSplash.hide(), []);

  useEffect(
    () =>
      Animated.timing(animatedValue, {
        toValue: toggle ? ANIMATION_MAX_VALUE : ANIMATION_MIN_VALUE,
        useNativeDriver: true
      }).start(() => setToggle(!toggle)),
    [toggle, animatedValue]
  );

  const scale = animatedValue.interpolate({
    inputRange: [ANIMATION_MIN_VALUE, ANIMATION_MAX_VALUE],
    outputRange: [1, 1.1]
  });

  return (
    <SafeAreaView style={DemoScreenStyles.safeAreaView}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={DemoScreenStyles.scrollView}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <TempleLogo
            width={32 * step}
            height={44 * step}
            style={DemoScreenStyles.logo}
          />
        </Animated.View>
        <Text style={DemoScreenStyles.title}>Temple Wallet</Text>
        <Text style={DemoScreenStyles.description}>coming soon</Text>
      </ScrollView>
    </SafeAreaView>
  );
};
