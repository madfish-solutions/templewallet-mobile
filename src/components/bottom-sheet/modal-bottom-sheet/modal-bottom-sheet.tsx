import React, { FC } from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { step } from '../../../config/styles';
import { zIndexEnum } from '../../../enums/z-index.enum';
import { Touchable } from '../../touchable/touchable';
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
        <Touchable onPress={controller.close}>
          <ModalBottomSheetCloseIcon width={closeIconSize} height={closeIconSize} />
        </Touchable>
      </View>
      <ScrollView style={ModalBottomSheetStyles.contentContainer}>{children}</ScrollView>
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
