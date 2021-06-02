import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { Text } from 'react-native';

import { EmptyFn } from '../../../config/general';
import { useBottomSheetActionButtonStyles } from './bottom-sheet-action-button.styles';

interface Props {
  title: string;
  onPress: EmptyFn;
}

export const BottomSheetActionButton: FC<Props> = ({ title, onPress }) => {
  const styles = useBottomSheetActionButtonStyles();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};
