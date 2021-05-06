import React, { FC } from 'react';

import { EmptyFn } from '../../config/general';
import { step, white } from '../../config/styles';
import { IconGlyphEnum } from '../icon/icon-glyph.enum';
import { Button } from './button';
import { ButtonLargePrimaryStyles } from './button-large-primary.styles';

interface Props {
  title: string;
  iconGlyph?: IconGlyphEnum;
  marginBottom?: number;
  marginRight?: number;
  onPress: EmptyFn;
}

export const ButtonLargePrimary: FC<Props> = ({ title, iconGlyph, marginBottom, marginRight, onPress }) => {
  return (
    <Button
      title={title}
      iconGlyph={iconGlyph}
      iconColor={white}
      iconSize={3 * step}
      iconMarginRight={step}
      containerStyle={ButtonLargePrimaryStyles.containerStyle}
      titleStyle={ButtonLargePrimaryStyles.titleStyle}
      marginBottom={marginBottom}
      marginRight={marginRight}
      onPress={onPress}
    />
  );
};
