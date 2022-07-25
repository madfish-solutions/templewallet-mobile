import React, { FC, useMemo } from 'react';
import { View } from 'react-native';
import FastImage, { Source } from 'react-native-fast-image';

import { formatSizeScaled } from '../../styles/format-size';
import { StaticTokenIconStyles } from './static-token-icon.styles';

interface Props {
  source: Source;
  size?: number;
}

export const StaticTokenIcon: FC<Props> = ({ source, size = formatSizeScaled(32) }) => {
  const style = useMemo(() => [{ width: size, height: size }], [size]);

  return (
    <View style={[StaticTokenIconStyles.container, { borderRadius: size / 2 }]}>
      <FastImage style={style} source={source} />
    </View>
  );
};
