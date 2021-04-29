import React, { FC, useEffect, useRef } from 'react';
import { Button, Text, useWindowDimensions, View } from 'react-native';
import ReanimatedBottomSheet from 'reanimated-bottom-sheet';

import { orange } from '../../../config/styles';
import { zIndexEnum } from '../../../enums/z-index.enum';
import { isDefined } from '../../../utils/is-defined';
import { BottomSheet } from '../bottom-sheet';
import { BottomSheetStateProps } from '../bottom-sheet-state.props';
import { DropdownBottomSheetStyles } from './dropdown-bottom-sheet.styles';

export const DropdownBottomSheet: FC<BottomSheetStateProps> = ({ title, isOpen, onClose, children }) => {
  const ref = useRef<ReanimatedBottomSheet>(null);
  const contentHeight = 0.5 * useWindowDimensions().height;

  useEffect(() => void (isDefined(ref.current) && ref.current.snapTo(isOpen ? 0 : 1)), [isOpen]);

  const closeBottomSheet = () => void (isDefined(ref.current) && ref.current.snapTo(1));

  const renderContent = () => (
    <View style={DropdownBottomSheetStyles.root}>
      <View style={DropdownBottomSheetStyles.headerContainer}>
        <Text style={DropdownBottomSheetStyles.title}>{title}</Text>
      </View>
      <View style={DropdownBottomSheetStyles.contentContainer}>{children}</View>
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
      onCloseEnd={onClose}
    />
  );
};
