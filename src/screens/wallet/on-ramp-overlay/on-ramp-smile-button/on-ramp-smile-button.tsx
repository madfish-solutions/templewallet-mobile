import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { StyleProp, Text, TextStyle, TouchableWithoutFeedbackProps } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { conditionalStyle } from 'src/utils/conditional-style';
import { setTestID } from 'src/utils/test-id.utils';

import { useOnRampSmileButtonStyles } from './on-ramp-smile-button.styles';

interface Props extends Pick<TouchableWithoutFeedbackProps, 'style' | 'onPress' | 'disabled'>, TestIdProps {
  smileIconName: IconNameEnum;
  title: string;
  titleStyle?: StyleProp<TextStyle>;
}

export const OnRampSmileButton: FC<Props> = ({
  smileIconName,
  title,
  disabled,
  style,
  titleStyle,
  onPress,
  testID
}) => {
  const styles = useOnRampSmileButtonStyles();

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.container, conditionalStyle(Boolean(disabled), styles.disabled), style]}
      onPress={onPress}
      {...setTestID(testID)}
    >
      <Icon name={smileIconName} size={formatSize(28)} />
      <Divider size={formatSize(6)} />
      <Text style={[styles.title, conditionalStyle(Boolean(disabled), styles.disabledTitle), titleStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};
