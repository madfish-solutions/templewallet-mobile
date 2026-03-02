import * as bottts from '@dicebear/bottts';
import { createAvatar } from '@dicebear/core';
import React, { FC, useMemo } from 'react';
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { formatSize } from 'src/styles/format-size';
import { fractionToPercentage } from 'src/utils/percentage.utils';

import { useRobotIconStyles } from './robot-icon.styles';

interface Props {
  seed: string;
  size?: number;
}

export const RobotIcon: FC<Props> = ({ seed, size = formatSize(44) }) => {
  const styles = useRobotIconStyles();

  const xml = useMemo(
    () =>
      createAvatar(bottts, {
        seed,
        size,
        scale: fractionToPercentage((size - formatSize(8)) / size).toNumber(),
        clip: false
      })
        .toString()
        .replace('undefined', ''),
    [seed, size]
  );

  return (
    <View style={styles.root}>
      <SvgXml xml={xml} />
    </View>
  );
};
