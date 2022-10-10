import React, { FC, useEffect } from 'react';
import { View } from 'react-native';
// eslint-disable-next-line import/default
import Animated, { Easing, useDerivedValue, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { formatSize } from '../../styles/format-size';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { LoaderLines } from './loader-lines';
import { useLoaderStyles } from './loader.styles';

export const Loader: FC = () => {
  const styles = useLoaderStyles();

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(-38 * 4, {
        duration: 2000,
        easing: Easing.linear
      }),
      0
    );
  }, []);

  const rotate = useDerivedValue(() => progress.value, []);

  return (
    <View style={styles.container}>
      <Animated.View style={styles.icon}>
        <LoaderLines progress={rotate} />
      </Animated.View>
      <Icon name={IconNameEnum.TempleLogo} width={formatSize(48)} height={formatSize(48)} />
    </View>
  );
};
