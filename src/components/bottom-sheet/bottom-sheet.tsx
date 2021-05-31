import GorhomBottomSheet, { TouchableOpacity } from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { emptyComponent } from '../../config/general';
import { BottomSheetBackdrop } from './bottom-sheet-backdrop/bottom-sheet-backdrop';
import { useDropdownBottomSheetStyles } from './bottom-sheet.styles';
import { BottomSheetControllerProps } from './use-bottom-sheet-controller';

interface Props extends BottomSheetControllerProps {
  title: string;
  contentHeight: number;
}

export const BottomSheet: FC<Props> = ({ title, contentHeight, controller, children }) => {
  const styles = useDropdownBottomSheetStyles();

  return (
    <Portal>
      <GorhomBottomSheet
        ref={controller.ref}
        snapPoints={[0, contentHeight]}
        handleComponent={emptyComponent}
        backgroundComponent={emptyComponent}
        backdropComponent={props => <BottomSheetBackdrop {...props} onPress={controller.close} />}>
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
      </GorhomBottomSheet>
    </Portal>
  );
};
