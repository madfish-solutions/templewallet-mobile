import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { Text, TouchableWithoutFeedbackProps } from 'react-native';

import { useBottomSheetActionButtonStyles } from './bottom-sheet-action-button.styles';

interface Props extends Pick<TouchableWithoutFeedbackProps, 'style' | 'onPress'>{
  title: string;
}

export const BottomSheetActionButton: FC<Props> = ({ title, style, onPress }) => {
  const styles = useBottomSheetActionButtonStyles();

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};
