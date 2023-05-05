import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { StyleProp, Text, TextStyle, TouchableWithoutFeedbackProps } from 'react-native';

import { TestIdProps } from 'src/interfaces/test-id.props';
import { setTestID } from 'src/utils/test-id.utils';

import { conditionalStyle } from '../../../../utils/conditional-style';
import { useOnRampSmileButtonStyles } from './on-ramp-smile-button.styles';

interface Props extends Pick<TouchableWithoutFeedbackProps, 'style' | 'onPress' | 'disabled'>, TestIdProps {
  smile: string;
  title: string;
  titleStyle?: StyleProp<TextStyle>;
}

export const OnRampSmileButton: FC<Props> = ({ smile, title, disabled, style, titleStyle, onPress, testID }) => {
  const styles = useOnRampSmileButtonStyles();

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.container, conditionalStyle(Boolean(disabled), styles.disabled), style]}
      onPress={onPress}
      {...setTestID(testID)}
    >
      <Text style={styles.smile}>{smile}</Text>
      <Text style={[styles.title, conditionalStyle(Boolean(disabled), styles.disabledTitle), titleStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};
