import { Portal } from '@gorhom/portal';
import React, { FC } from 'react';
import { Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

import { step } from '../../../config/styles';
import { PortalNameEnum } from '../../../enums/portal-name.enum';
import { BottomSheet } from '../bottom-sheet';
import { BottomSheetStateProps } from '../bottom-sheet-state.props';
import ModalBottomSheetCloseIcon from './modal-bottom-sheet-close-icon.svg';
import { ModalBottomSheetStyles } from './modal-bottom-sheet.styles';

export const ModalBottomSheet: FC<BottomSheetStateProps> = ({ title, isOpen, onClose, children }) => {
  const height = useWindowDimensions().height - 20 * step;

  const renderContent = () => (
    <View style={ModalBottomSheetStyles.root}>
      <View style={ModalBottomSheetStyles.headerContainer}>
        <View />
        <Text style={ModalBottomSheetStyles.title}>{title}</Text>
        <TouchableOpacity onPress={onClose}>
          <ModalBottomSheetCloseIcon />
        </TouchableOpacity>
      </View>
      <View style={ModalBottomSheetStyles.contentContainer}>{children}</View>
    </View>
  );

  return (
    <Portal name={PortalNameEnum.Modal}>
      {isOpen && <BottomSheet height={height} renderContent={renderContent} onCloseEnd={onClose} />}
    </Portal>
  );
};
