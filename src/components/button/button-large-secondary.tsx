import React, { FC } from 'react';

import { EmptyFn } from '../../config/general';
import { orange, step } from '../../config/styles';
import { IconGlyphEnum } from '../icon/icon-glyph.enum';
import { Button } from './button';
import { ButtonLargeSecondaryStyles } from './button-large-secondary.styles';

interface Props {
  title: string;
  iconGlyph?: IconGlyphEnum;
  onPress: EmptyFn;
}

export const ButtonLargeSecondary: FC<Props> = ({ title, iconGlyph, onPress }) => {
  return (
    <Button
      title={title}
      iconGlyph={iconGlyph}
      iconColor={orange}
      iconSize={3 * step}
      iconMarginRight={step}
      containerStyle={ButtonLargeSecondaryStyles.containerStyle}
      titleStyle={ButtonLargeSecondaryStyles.titleStyle}
      onPress={onPress}
    />
  );
};
