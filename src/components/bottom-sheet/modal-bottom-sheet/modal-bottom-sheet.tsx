import React, { FC } from 'react';
import { Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

import { step } from '../../../config/styles';
import { zIndexEnum } from '../../../enums/z-index.enum';
import { BottomSheet } from '../bottom-sheet';
import { BottomSheetStateProps } from '../bottom-sheet-state.props';
import { useBottomSheetRef } from '../use-bottom-sheet-ref.hook';
import ModalBottomSheetCloseIcon from './modal-bottom-sheet-close-icon.svg';
import { closeIconSize, ModalBottomSheetStyles } from './modal-bottom-sheet.styles';

interface Props extends BottomSheetStateProps {
  title: string;
}

export const ModalBottomSheet: FC<Props> = ({ title, isOpen, onCloseEnd, children }) => {
  const { ref, closeBottomSheet } = useBottomSheetRef(isOpen);
  const contentHeight = useWindowDimensions().height - 20 * step;

  const renderContent = () => (
    <View style={ModalBottomSheetStyles.root}>
      <View style={ModalBottomSheetStyles.headerContainer}>
        <View style={ModalBottomSheetStyles.iconSubstitute} />
        <Text style={ModalBottomSheetStyles.title}>{title}</Text>
        <TouchableOpacity onPress={closeBottomSheet}>
          <ModalBottomSheetCloseIcon width={closeIconSize} height={closeIconSize} />
        </TouchableOpacity>
      </View>
      <View style={ModalBottomSheetStyles.contentContainer}>{children}</View>
    </View>
  );

  return (
    <BottomSheet
      ref={ref}
      isOpen={isOpen}
      contentHeight={contentHeight}
      overlayZIndex={zIndexEnum.ModalBottomSheetOverlay}
      contentZIndex={zIndexEnum.ModalBottomSheetContent}
      renderContent={renderContent}
      onOverlayPress={closeBottomSheet}
      onCloseEnd={onCloseEnd}
    />
  );
};
