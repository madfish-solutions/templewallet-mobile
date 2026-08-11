import * as bottts from '@dicebear/bottts';
import { createAvatar } from '@dicebear/core';
import React, { FC, useMemo } from 'react';
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { formatSize } from 'src/styles/format-size';

import { useRobotIconStyles } from './robot-icon.styles';

interface Props {
  seed: string;
  size?: number;
  color?: 'blue' | 'gray' | 'orange' | 'none';
}

export const RobotIcon: FC<Props> = ({ seed, size = formatSize(40), color = 'gray' }) => {
  const styles = useRobotIconStyles();

  const xml = useMemo(
    () =>
      createAvatar(bottts, { seed, size: size - formatSize(4), clip: false })
        .toString()
        .replace('undefined', ''),
    [seed, size]
  );

  const sizeDerivedStyles = useMemo(
    () => ({
      root: { borderRadius: formatSize(2) + size / 10 },
      icon: { borderRadius: (color === 'none' ? 0 : formatSize(2)) + size / 10 }
    }),
    [size, color]
  );

  return (
    <View style={[styles.root, sizeDerivedStyles.root, styles[color]]}>
      <SvgXml xml={xml} style={sizeDerivedStyles.icon} />
    </View>
  );
};
