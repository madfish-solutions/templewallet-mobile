import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { Text } from 'react-native';

import { EmptyFn } from '../../../../config/general';
import { useDropdownBottomSheetActionButtonStyles } from './dropdown-bottom-sheet-action-button.styles';

interface Props {
  title: string;
  onPress: EmptyFn;
}

export const DropdownBottomSheetActionButton: FC<Props> = ({ title, onPress }) => {
  const styles = useDropdownBottomSheetActionButtonStyles();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};
