import React, { FC, useEffect } from 'react';
import { View } from 'react-native';
// eslint-disable-next-line import/default
import Animated, { Easing, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { formatSize } from '../../styles/format-size';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';

import { LoaderLines, VECTOR_SIZE } from './loader-lines';
import { useLoaderStyles } from './loader.styles';

const width = formatSize(48);
const height = formatSize(24);

export const Loader: FC = () => {
  const styles = useLoaderStyles();

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(-VECTOR_SIZE * 4, {
        duration: 2000,
        easing: Easing.linear
      }),
      0
    );
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <View style={styles.container}>
          <Icon name={IconNameEnum.TempleLogoBottom} width={width} height={height} />
          <Animated.View style={styles.icon}>
            <LoaderLines progress={progress} />
          </Animated.View>
          <Icon name={IconNameEnum.TempleLogoUp} width={width} height={height} />
        </View>
      </View>
    </View>
  );
};
