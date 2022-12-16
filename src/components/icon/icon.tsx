import React, { FC, useMemo } from 'react';
import { ViewStyle } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { IconNameEnum } from './icon-name.enum';
import { iconNameMap } from './icon-name.map';

export interface IconProps {
  name: IconNameEnum;
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  style?: ViewStyle;
}

export const Icon: FC<IconProps> = ({ name, size = formatSize(16), width = size, height = size, color, style }) => {
  const Svg = useMemo(() => iconNameMap[name], [name]);

  return <Svg width={width} height={height} color={color} style={style} />;
};
