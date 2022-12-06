import GorhomBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetProps,
  TouchableOpacity
} from '@gorhom/bottom-sheet';
import { BackdropPressBehavior } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { Portal } from '@gorhom/portal';
import { max } from 'lodash-es';
import React, { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { BackHandler, Keyboard, Text, View } from 'react-native';
import { useOrientationChange } from 'react-native-orientation-locker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { emptyComponent } from '../../config/general';
import { useAppLock } from '../../shelter/app-lock/app-lock';
import { formatSize } from '../../styles/format-size';
import { isDefined } from '../../utils/is-defined';
import { useDropdownBottomSheetStyles } from './bottom-sheet.styles';
import { BottomSheetControllerProps } from './use-bottom-sheet-controller';

interface Props extends BottomSheetControllerProps, Pick<BottomSheetProps, 'enablePanDownToClose'> {
  title?: string;
  description: string;
  cancelButtonText?: string;
  contentHeight: number;
  backdropPressBehavior?: BackdropPressBehavior;
}

export const BottomSheet: FC<Props> = ({
  title,
  description,
  cancelButtonText,
  contentHeight,
  controller,
  enablePanDownToClose = true,
  backdropPressBehavior,
  children
}) => {
  // hack that prevents rendering of GorhomBottomSheet component for locked app state,
  // as it loads heavy Reanimated 2 modules and application do not respond on gestures
  // TODO: try to remove this with @gorhom/bottom-sheet > 4.0.0
  const { isLocked } = useAppLock();
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
        pressBehavior={backdropPressBehavior}
      />
    ),
    [styles.backdrop]
  );

  const handleChange = (index: number) => {
    setIsOpened(index !== -1);
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (isOpened) {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        controller.close();

        return true;
      });

      return () => backHandler.remove();
    }
  }, [isOpened]);

  useOrientationChange(() => controller.close());

  return (
    <Portal>
      {!isLocked && (
        <GorhomBottomSheet
          ref={controller.ref}
          index={-1}
          snapPoints={[contentHeight]}
          enablePanDownToClose={enablePanDownToClose}
          bottomInset={bottomInset}
          handleComponent={emptyComponent}
          backgroundComponent={emptyComponent}
          backdropComponent={renderBackdropComponent}
          onChange={handleChange}
        >
          <View style={styles.root}>
            <View style={styles.headerContainer}>
              {isDefined(title) && <Text style={styles.title}>{title}</Text>}
              <Text style={styles.description}>{description}</Text>
            </View>

            {children}

            {isDefined(cancelButtonText) && (
              <TouchableOpacity style={styles.cancelButton} onPress={controller.close}>
                <Text style={styles.cancelButtonText}>{cancelButtonText}</Text>
              </TouchableOpacity>
            )}
          </View>
        </GorhomBottomSheet>
      )}
    </Portal>
  );
};
