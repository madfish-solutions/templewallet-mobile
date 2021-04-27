import { Portal } from '@gorhom/portal';
import React, { FC } from 'react';
import { useWindowDimensions, View } from 'react-native';

import { step } from '../../../config/styles';
import { PortalNameEnum } from '../../../enums/portal-name.enum';
import { BottomSheet } from '../bottom-sheet';
import { BottomSheetStateProps } from '../bottom-sheet-state.props';
import { BottomSheetStyles } from '../bottom-sheet.styles';

export const DropdownBottomSheet: FC<BottomSheetStateProps> = ({ isOpen, onClose, children }) => {
  const height = useWindowDimensions().height - 40 * step;

  const renderContent = () => (
    <View style={[BottomSheetStyles.contentContainer, { backgroundColor: 'red' }]}>{children}</View>
  );

  return (
    <Portal name={PortalNameEnum.Dropdown}>
      {isOpen && <BottomSheet height={height} renderContent={renderContent} onCloseEnd={onClose} />}
    </Portal>
  );
};
