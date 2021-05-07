import React, { FC, useMemo } from 'react';
import { ViewStyle } from 'react-native';

import { step } from '../../config/styles';
import { IconNameEnum } from './icon-name.enum';
import { iconNameMap } from './icon-name.map';

export interface IconProps {
  name: IconNameEnum;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export const Icon: FC<IconProps> = ({ name, size = 2 * step, color, style }) => {
  const Svg = useMemo(() => iconNameMap[name], [name]);

  return <Svg width={size} height={size} color={color} style={style} />;
};
