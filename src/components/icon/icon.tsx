import React, { FC, useMemo } from 'react';
import { ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';

import { TestIdProps } from '../../interfaces/test-id.props';
import { formatSize } from '../../styles/format-size';
import { IconNameEnum } from './icon-name.enum';
import { iconNameMap } from './icon-name.map';

export interface IconProps extends TestIdProps, SvgProps {
  name: IconNameEnum;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export const Icon: FC<IconProps> = ({
  name,
  size = formatSize(16),
  width = size,
  height = size,
  color,
  style,
  testID
}) => {
  const Svg = useMemo(() => iconNameMap[name], [name]);

  return <Svg width={width} height={height} color={color} style={style} testID={testID} />;
};
