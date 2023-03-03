import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { Text, TouchableWithoutFeedbackProps } from 'react-native';

import { TestIdProps } from '../../../interfaces/test-id.props';
import { setTestID } from '../../../utils/test-id.utils';
import { useBottomSheetActionButtonStyles } from './bottom-sheet-action-button.styles';

interface Props extends Pick<TouchableWithoutFeedbackProps, 'style' | 'onPress'>, TestIdProps {
  title: string;
}

export const BottomSheetActionButton: FC<Props> = ({ title, style, onPress, testID }) => {
  const styles = useBottomSheetActionButtonStyles();

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress} {...setTestID(testID)}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};
