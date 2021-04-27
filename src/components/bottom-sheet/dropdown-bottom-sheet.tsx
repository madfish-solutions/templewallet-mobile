import { Portal } from '@gorhom/portal';
import React, { FC } from 'react';
import { useWindowDimensions, View } from 'react-native';

import { step } from '../../config/styles';
import { BottomSheet, BottomSheetProps } from './bottom-sheet';
import { BottomSheetStyles } from './bottom-sheet.styles';

export const DropdownBottomSheet: FC<BottomSheetProps> = ({ isOpen, onDismiss, children }) => {
  const height = useWindowDimensions().height - 40 * step;

  const renderContent = () => (
    <View style={[BottomSheetStyles.contentContainer, { backgroundColor: 'red' }]}>{children}</View>
  );

  return (
    <Portal name="Dropdown">
      <BottomSheet isOpen={isOpen} onDismiss={onDismiss} height={height} renderContent={renderContent} />
    </Portal>
  );
};
