import React, { FC, useEffect, useRef } from 'react';
import { Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import ReanimatedBottomSheet from 'reanimated-bottom-sheet';

import { step } from '../../../config/styles';
import { zIndexEnum } from '../../../enums/z-index.enum';
import { isDefined } from '../../../utils/is-defined';
import { BottomSheet } from '../bottom-sheet';
import { BottomSheetStateProps } from '../bottom-sheet-state.props';
import ModalBottomSheetCloseIcon from './modal-bottom-sheet-close-icon.svg';
import { closeIconSize, ModalBottomSheetStyles } from './modal-bottom-sheet.styles';

export const ModalBottomSheet: FC<BottomSheetStateProps> = ({ title, isOpen, onClose, children }) => {
  const ref = useRef<ReanimatedBottomSheet>(null);
  const contentHeight = useWindowDimensions().height - 20 * step;

  useEffect(() => void (isDefined(ref.current) && ref.current.snapTo(isOpen ? 0 : 1)), [isOpen]);

  const closeBottomSheet = () => void (isDefined(ref.current) && ref.current.snapTo(1));

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
      onCloseEnd={onClose}
    />
  );
};
