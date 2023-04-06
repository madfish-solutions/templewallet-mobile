import React, { FC, useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

import { basicLightColors } from '../../styles/colors';
import { formatSize } from '../../styles/format-size';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';

interface Props {
  style?: StyleProp<ViewStyle>;
}

const ANIMATED_TIME = 1600;
const DURATION = ANIMATED_TIME / 2;

export const AnimatedAlertIcon: FC<Props> = ({ style }) => {
  const opcaityAnimatedValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(opcaityAnimatedValue, {
        toValue: 0,
        duration: DURATION,
        useNativeDriver: true
      }).start(() => {
        Animated.timing(opcaityAnimatedValue, {
          toValue: 1,
          duration: DURATION,
          useNativeDriver: true
        }).start();
      });
    }, ANIMATED_TIME);

    return () => clearInterval(interval);
  }, []);

  return (
    <Animated.View style={[style, { opacity: opcaityAnimatedValue }]}>
      <Icon name={IconNameEnum.AlertCircle} size={formatSize(12)} color={basicLightColors.white} />
    </Animated.View>
  );
};
