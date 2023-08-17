import GorhomBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  TouchableOpacity
} from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import { max } from 'lodash-es';
import React, { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { BackHandler, Keyboard, Text, View } from 'react-native';
import { useOrientationChange } from 'react-native-orientation-locker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { emptyComponent, emptyFn, EmptyFn } from '../../config/general';
import { useAppLock } from '../../shelter/app-lock/app-lock';
import { formatSize } from '../../styles/format-size';
import { isDefined } from '../../utils/is-defined';
import { useDropdownBottomSheetStyles } from './bottom-sheet.styles';
import { BottomSheetControllerProps } from './use-bottom-sheet-controller';

interface Props extends BottomSheetControllerProps {
  title?: string;
  description?: string;
  isCanselButtonShown?: boolean;
  cancelButtonText?: string;
  onCancelButtonPress?: EmptyFn;
  contentHeight: number;
}

export const BottomSheet: FC<Props> = ({
  title,
  description,
  isCanselButtonShown = true,
  cancelButtonText = 'Cancel',
  onCancelButtonPress = emptyFn,
  contentHeight,
  controller,
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
      />
    ),
    [styles.backdrop]
  );

  const handleChange = (index: number) => {
    setIsOpened(index !== -1);
    Keyboard.dismiss();
  };
  const handleCancelPress = () => {
    controller.close();
    onCancelButtonPress();
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
          enablePanDownToClose={true}
          bottomInset={bottomInset}
          handleComponent={emptyComponent}
          backgroundComponent={emptyComponent}
          backdropComponent={renderBackdropComponent}
          onChange={handleChange}
        >
          <View style={styles.root}>
            {(isDefined(title) || isDefined(description)) && (
              <View style={styles.headerContainer}>
                {isDefined(title) && <Text style={styles.title}>{title}</Text>}
                {isDefined(description) && <Text style={styles.description}>{description}</Text>}
              </View>
            )}

            {children}

            {isCanselButtonShown && (
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelPress}>
                <Text style={styles.cancelButtonText}>{cancelButtonText}</Text>
              </TouchableOpacity>
            )}
          </View>
        </GorhomBottomSheet>
      )}
    </Portal>
  );
};
