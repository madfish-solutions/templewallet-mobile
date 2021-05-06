import React, { FC, useMemo } from 'react';
import { ViewStyle } from 'react-native';

import { step } from '../../config/styles';
import { IconGlyphEnum } from './icon-glyph.enum';
import { iconGlyphMap } from './icon-glyph.map';

export interface IconProps {
  glyph: IconGlyphEnum;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export const Icon: FC<IconProps> = ({ glyph, size = 2 * step, color, style }) => {
  const Svg = useMemo(() => iconGlyphMap[glyph], [glyph]);

  return <Svg width={size} height={size} color={color} style={style} />;
};
