import React, { FC } from 'react';
import { StyleProp, Text, TextStyle, TouchableWithoutFeedbackProps } from 'react-native';

import { TestIdProps } from 'src/interfaces/test-id.props';
import { conditionalStyle } from 'src/utils/conditional-style';
import { setTestID } from 'src/utils/test-id.utils';

import { TouchableWithAnalytics } from '../../touchable-with-analytics';
import { useBottomSheetActionButtonStyles } from './bottom-sheet-action-button.styles';

interface Props extends Pick<TouchableWithoutFeedbackProps, 'style' | 'onPress' | 'disabled'>, TestIdProps {
  title: string;
  titleStyle?: StyleProp<TextStyle>;
}

export const BottomSheetActionButton: FC<Props> = ({ title, disabled, style, titleStyle, onPress, testID }) => {
  const styles = useBottomSheetActionButtonStyles();

  return (
    <TouchableWithAnalytics
      disabled={disabled}
      style={[styles.container, conditionalStyle(Boolean(disabled), styles.disabled), style]}
      onPress={onPress}
      {...setTestID(testID)}
    >
      <Text style={[styles.title, conditionalStyle(Boolean(disabled), styles.disabledTitle), titleStyle]}>{title}</Text>
    </TouchableWithAnalytics>
  );
};
