import React, { FC } from 'react';
import { Button, ScrollView, Text, useWindowDimensions, View } from 'react-native';

import { orange } from '../../../config/styles';
import { zIndexEnum } from '../../../enums/z-index.enum';
import { BottomSheet } from '../bottom-sheet';
import { BottomSheetStateProps } from '../bottom-sheet-state.props';
import { useBottomSheetRef } from '../use-bottom-sheet-ref.hook';
import { DropdownBottomSheetStyles } from './dropdown-bottom-sheet.styles';

interface Props extends BottomSheetStateProps {
  title: string;
}

export const DropdownBottomSheet: FC<Props> = ({ title, isOpen, onCloseEnd, children }) => {
  const { ref, closeBottomSheet } = useBottomSheetRef(isOpen);
  const contentHeight = 0.5 * useWindowDimensions().height;

  const renderContent = () => (
    <View style={DropdownBottomSheetStyles.root}>
      <View style={DropdownBottomSheetStyles.headerContainer}>
        <Text style={DropdownBottomSheetStyles.title}>{title}</Text>
      </View>
      <ScrollView style={DropdownBottomSheetStyles.scrollView}>
        <View style={DropdownBottomSheetStyles.contentContainer}>{children}</View>
      </ScrollView>
      <View style={DropdownBottomSheetStyles.footerContainer}>
        <Button title="Cancel" color={orange} onPress={closeBottomSheet} />
      </View>
    </View>
  );

  return (
    <BottomSheet
      ref={ref}
      isOpen={isOpen}
      contentHeight={contentHeight}
      overlayZIndex={zIndexEnum.DropdownBottomSheetOverlay}
      contentZIndex={zIndexEnum.DropdownBottomSheetContent}
      renderContent={renderContent}
      onOverlayPress={closeBottomSheet}
      onCloseEnd={onCloseEnd}
    />
  );
};
