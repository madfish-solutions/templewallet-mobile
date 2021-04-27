import { Portal } from '@gorhom/portal';
import React, { FC } from 'react';
import { Button, Text, useWindowDimensions, View } from 'react-native';

import { orange } from '../../../config/styles';
import { PortalNameEnum } from '../../../enums/portal-name.enum';
import { BottomSheet } from '../bottom-sheet';
import { BottomSheetStateProps } from '../bottom-sheet-state.props';
import { DropdownBottomSheetStyles } from './dropdown-bottom-sheet.styles';

export const DropdownBottomSheet: FC<BottomSheetStateProps> = ({ title, isOpen, onClose, children }) => {
  const height = 0.5 * useWindowDimensions().height;

  const renderContent = () => (
    <View style={DropdownBottomSheetStyles.root}>
      <View style={DropdownBottomSheetStyles.headerContainer}>
        <Text style={DropdownBottomSheetStyles.title}>{title}</Text>
      </View>
      <View style={DropdownBottomSheetStyles.contentContainer}>{children}</View>
      <View style={DropdownBottomSheetStyles.footerContainer}>
        <Button title="Cancel" color={orange} onPress={onClose} />
      </View>
    </View>
  );

  return (
    <Portal name={PortalNameEnum.Dropdown}>
      {isOpen && <BottomSheet height={height} renderContent={renderContent} onCloseEnd={onClose} />}
    </Portal>
  );
};
