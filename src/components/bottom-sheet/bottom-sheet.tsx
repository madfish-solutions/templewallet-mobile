import GorhomBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  TouchableOpacity
} from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import { max } from 'lodash-es';
import React, { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { BackHandler, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { emptyComponent } from '../../config/general';
import { formatSize } from '../../styles/format-size';
import { useDropdownBottomSheetStyles } from './bottom-sheet.styles';
import { BottomSheetControllerProps } from './use-bottom-sheet-controller';

interface Props extends BottomSheetControllerProps {
  title: string;
  contentHeight: number;
}

export const BottomSheet: FC<Props> = ({ title, contentHeight, controller, children }) => {
  const styles = useDropdownBottomSheetStyles();
  const insets = useSafeAreaInsets();
  const [isOpened, setIsOpened] = useState(false);

  const bottomInset = max([insets.bottom, formatSize(8)]);
  const renderBackdropComponent = useCallback(
    (props: PropsWithChildren<BottomSheetBackdropProps>) => (
      <BottomSheetBackdrop
        {...props}
        style={[props.style, styles.backdrop]}
        opacity={0.16}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [styles.backdrop]
  );

  const handleChange = (index: number) => setIsOpened(index !== -1);

  useEffect(() => {
    if (isOpened) {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        controller.close();

        return true;
      });

      return () => backHandler.remove();
    }
  }, [isOpened]);

  return (
    <Portal>
      <GorhomBottomSheet
        ref={controller.ref}
        index={-1}
        snapPoints={[contentHeight]}
        enablePanDownToClose={true}
        bottomInset={bottomInset}
        handleComponent={emptyComponent}
        backgroundComponent={emptyComponent}
        backdropComponent={renderBackdropComponent}
        onChange={handleChange}>
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
