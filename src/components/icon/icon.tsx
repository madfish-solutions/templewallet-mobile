import React, { FC, useMemo } from 'react';

import { step } from '../../config/styles';
import { IconGlyphEnum } from './icon-glyph.enum';
import { iconGlyphMap } from './icon-glyph.map';

export interface IconProps {
  glyph: IconGlyphEnum;
  size?: number;
  color?: string;
}

export const Icon: FC<IconProps> = ({ glyph, size = 2 * step, color }) => {
  const Svg = useMemo(() => iconGlyphMap[glyph], [glyph]);

  return <Svg width={size} height={size} color={color} />;
};
