import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { Text, TouchableWithoutFeedbackProps } from 'react-native';

import { TestIdProps } from 'src/interfaces/test-id.props';
import { conditionalStyle } from 'src/utils/conditional-style';
import { setTestID } from 'src/utils/test-id.utils';

import { useBottomSheetActionButtonStyles } from './bottom-sheet-action-button.styles';

interface Props extends Pick<TouchableWithoutFeedbackProps, 'style' | 'onPress' | 'disabled'>, TestIdProps {
  title: string;
}

export const BottomSheetActionButton: FC<Props> = ({ title, disabled, style, onPress, testID }) => {
  const styles = useBottomSheetActionButtonStyles();

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.container, conditionalStyle(Boolean(disabled), styles.disabled), style]}
      onPress={onPress}
      {...setTestID(testID)}
    >
      <Text style={[styles.title, conditionalStyle(Boolean(disabled), styles.disabledTitle)]}>{title}</Text>
    </TouchableOpacity>
  );
};
