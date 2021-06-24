import { createAvatar } from '@dicebear/avatars';
import * as botttsSprites from '@dicebear/avatars-bottts-sprites';
import React, { FC, useMemo } from 'react';
import { SvgXml } from 'react-native-svg';

import { formatSize } from '../../styles/format-size';
import { useRobotIconStyles } from './robot-icon.styles';

interface Props {
  seed: string;
  size?: number;
}

export const RobotIcon: FC<Props> = ({ seed, size = formatSize(44) }) => {
  const styles = useRobotIconStyles();

  const xml = useMemo(
    () =>
      createAvatar(botttsSprites, {
        seed,
        margin: formatSize(4),
        width: size,
        height: size
      }).replace('undefined', ''),
    [seed, size]
  );

  return <SvgXml xml={xml} style={styles.icon} />;
};
