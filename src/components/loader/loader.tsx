import React, { FC, useEffect, useMemo } from 'react';
import { View } from 'react-native';
// eslint-disable-next-line import/default
import Animated, { Easing, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { formatSize } from '../../styles/format-size';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { LoaderLines, VECTOR_SIZE } from './loader-lines';
import { useLoaderStyles } from './loader.styles';

interface Props {
  size?: number;
}

export const Loader: FC<Props> = ({ size = 64 }) => {
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

  const logoWidth = useMemo(() => formatSize((size / 4) * 3), []);
  const logoHeight = useMemo(() => formatSize((size / 8) * 3), []);

  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <View style={styles.container}>
          <Icon name={IconNameEnum.TempleLogoBottom} width={logoWidth} height={logoHeight} />
          <Animated.View style={styles.icon}>
            <LoaderLines size={size} progress={progress} />
          </Animated.View>
          <Icon name={IconNameEnum.TempleLogoUp} width={logoWidth} height={logoHeight} />
        </View>
      </View>
    </View>
  );
};
