import GorhomBottomSheet, { TouchableOpacity } from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import React, { FC, useContext } from 'react';
import { Text, View } from 'react-native';

import { emptyComponent } from '../../config/general';
import { TabBarHeightContext } from '../../navigator/tab-bar-height-provider';
import { BottomSheetBackdrop } from './bottom-sheet-backdrop/bottom-sheet-backdrop';
import { useDropdownBottomSheetStyles } from './bottom-sheet.styles';
import { BottomSheetControllerProps } from './use-bottom-sheet-controller';

interface Props extends BottomSheetControllerProps {
  title: string;
  contentHeight: number;
}

export const BottomSheet: FC<Props> = ({ title, contentHeight, controller, children }) => {
  const styles = useDropdownBottomSheetStyles();
  const { height: tabBarHeight } = useContext(TabBarHeightContext);

  return (
    <Portal>
      <GorhomBottomSheet
        ref={controller.ref}
        snapPoints={[0, contentHeight]}
        bottomInset={tabBarHeight}
        handleComponent={emptyComponent}
        backgroundComponent={emptyComponent}
        backdropComponent={props => <BottomSheetBackdrop {...props} onPress={controller.close} />}>
        <View style={styles.root}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>

          {children}

          <TouchableOpacity style={styles.cancelButton} onPress={controller.close}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </GorhomBottomSheet>
    </Portal>
  );
};
