import React, { FC } from 'react';

import { IconGlyphEnum } from '../../icon/icon-glyph.enum';
import { Button } from '../button';
import { ButtonSharedProps } from '../button-shared.props';
import { buttonMediumStyleConfig } from './button-medium.styles';

interface Props extends ButtonSharedProps {
  title: string;
  iconGlyph: IconGlyphEnum;
}

export const ButtonMedium: FC<Props> = props => <Button {...props} styleConfig={buttonMediumStyleConfig} />;
