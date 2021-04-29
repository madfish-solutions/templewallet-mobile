import React, { FC } from 'react';
import { Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

import { step } from '../../../config/styles';
import { zIndexEnum } from '../../../enums/z-index.enum';
import { BottomSheet } from '../bottom-sheet';
import { BottomSheetControllerProps } from '../use-bottom-sheet-controller';
import ModalBottomSheetCloseIcon from './modal-bottom-sheet-close-icon.svg';
import { closeIconSize, ModalBottomSheetStyles } from './modal-bottom-sheet.styles';

interface Props extends BottomSheetControllerProps {
  title: string;
}

export const ModalBottomSheet: FC<Props> = ({ title, controller, children }) => {
  const contentHeight = useWindowDimensions().height - 20 * step;

  const renderContent = () => (
    <View style={ModalBottomSheetStyles.root}>
      <View style={ModalBottomSheetStyles.headerContainer}>
        <View style={ModalBottomSheetStyles.iconSubstitute} />
        <Text style={ModalBottomSheetStyles.title}>{title}</Text>
        <TouchableOpacity onPress={controller.close}>
          <ModalBottomSheetCloseIcon width={closeIconSize} height={closeIconSize} />
        </TouchableOpacity>
      </View>
      <View style={ModalBottomSheetStyles.contentContainer}>{children}</View>
    </View>
  );

  return (
    <BottomSheet
      controller={controller}
      contentHeight={contentHeight}
      overlayZIndex={zIndexEnum.ModalBottomSheetOverlay}
      contentZIndex={zIndexEnum.ModalBottomSheetContent}
      renderContent={renderContent}
    />
  );
};
