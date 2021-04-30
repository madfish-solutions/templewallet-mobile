import React, { FC } from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { orange } from '../../../config/styles';
import { zIndexEnum } from '../../../enums/z-index.enum';
import { Button } from '../../button/button';
import { BottomSheet } from '../bottom-sheet';
import { BottomSheetControllerProps } from '../use-bottom-sheet-controller';
import { DropdownBottomSheetStyles } from './dropdown-bottom-sheet.styles';

interface Props extends BottomSheetControllerProps {
  title: string;
}

export const DropdownBottomSheet: FC<Props> = ({ title, controller, children }) => {
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
        <Button title="Cancel" color={orange} onPress={controller.close} />
      </View>
    </View>
  );

  return (
    <BottomSheet
      controller={controller}
      contentHeight={contentHeight}
      overlayZIndex={zIndexEnum.DropdownBottomSheetOverlay}
      contentZIndex={zIndexEnum.DropdownBottomSheetContent}
      renderContent={renderContent}
    />
  );
};
