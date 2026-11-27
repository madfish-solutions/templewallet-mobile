import React, { memo, useEffect } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { formatSize } from 'src/styles/format-size';
import { setTestID } from 'src/utils/test-id.utils';

import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';

import { LoaderLines, VECTOR_SIZE } from './loader-lines';
import { useLoaderStyles } from './loader.styles';
import { LoaderSelectors } from './selectors';

const width = formatSize(48);
const height = formatSize(24);

export const Loader = memo(() => {
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
    <View style={styles.root} {...setTestID(LoaderSelectors.loader)}>
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
});
