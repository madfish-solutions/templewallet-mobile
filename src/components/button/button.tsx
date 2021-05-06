import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { Text, TextStyle, ViewStyle } from 'react-native';

import { EmptyFn } from '../../config/general';
import { isDefined } from '../../utils/is-defined';
import { Icon } from '../icon/icon';
import { IconGlyphEnum } from '../icon/icon-glyph.enum';
import { ButtonStyles } from './button.styles';

interface Props {
  title?: string;

  iconGlyph?: IconGlyphEnum;
  iconSize?: number;
  iconColor?: string;
  iconMarginRight?: number;

  disabled?: boolean;

  containerStyle: ViewStyle;
  titleStyle: TextStyle;

  marginBottom?: number;
  marginRight?: number;

  onPress: EmptyFn;
}

export const Button: FC<Props> = ({
  title,

  iconGlyph,
  iconSize,
  iconColor,
  iconMarginRight,

  disabled,

  containerStyle,
  titleStyle,

  marginBottom,
  marginRight,

  onPress
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        ButtonStyles.containerStyle,
        containerStyle,
        isDefined(marginBottom) ? { marginBottom } : {},
        isDefined(marginRight) ? { marginRight } : {}
      ]}
      onPress={onPress}>
      {isDefined(iconGlyph) && (
        <Icon
          glyph={iconGlyph}
          size={iconSize}
          color={iconColor}
          {...(isDefined(title) && { style: { marginRight: iconMarginRight } })}
        />
      )}
      <Text style={titleStyle}>{title}</Text>
    </TouchableOpacity>
  );
};
