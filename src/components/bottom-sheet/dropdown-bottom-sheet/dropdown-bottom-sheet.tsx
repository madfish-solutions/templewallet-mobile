import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { Text, useWindowDimensions, View } from 'react-native';

import { BottomSheet } from '../bottom-sheet';
import { BottomSheetControllerProps } from '../use-bottom-sheet-controller';
import { useDropdownBottomSheetStyles } from './dropdown-bottom-sheet.styles';

interface Props extends BottomSheetControllerProps {
  title: string;
}

export const DropdownBottomSheet: FC<Props> = ({ title, controller, children }) => {
  const styles = useDropdownBottomSheetStyles();
  const contentHeight = 0.5 * useWindowDimensions().height;

  return (
    <BottomSheet controller={controller} contentHeight={contentHeight} hasBackgroundComponent={false}>
      <View style={styles.root}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>

        {children}

        <View style={styles.footerContainer}>
          <TouchableOpacity onPress={controller.close}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
};
