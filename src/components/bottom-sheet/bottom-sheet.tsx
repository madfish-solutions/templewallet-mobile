import GorhomBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
  TouchableOpacity
} from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import React, { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, Keyboard, Text, View } from 'react-native';
import { useOrientationChange } from 'react-native-orientation-locker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { emptyComponent, emptyFn } from 'src/config/general';
import { useAppLock } from 'src/shelter/app-lock/app-lock';
import { formatSize } from 'src/styles/format-size';
import { isDefined } from 'src/utils/is-defined';

import { useDropdownBottomSheetStyles } from './bottom-sheet.styles';
import { BottomSheetControllerProps } from './use-bottom-sheet-controller';

interface Props extends BottomSheetControllerProps {
  title?: string;
  description?: string;
  cancelButtonText?: string;
  onCancelButtonPress?: EmptyFn;
  cancelButtonTestID?: string;
  onClose?: EmptyFn;
  contentHeight: number;
  isInitiallyOpen?: boolean;
}

export const BottomSheet: FCWithChildren<Props> = ({
  title,
  description,
  cancelButtonText = 'Cancel',
  cancelButtonTestID,
  isInitiallyOpen = false,
  onCancelButtonPress = emptyFn,
  onClose = emptyFn,
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

  const wasAnimatedRef = useRef(false);
  const handleAnimate = useCallback(() => {
    wasAnimatedRef.current = true;
  }, []);

  const renderBackdropComponent = useCallback(
    (props: PropsWithChildren<BottomSheetBackdropProps>) => (
      <BottomSheetBackdrop
        {...props}
        style={[props.style, styles.backdrop]}
        opacity={wasAnimatedRef.current || isInitiallyOpen ? 0.16 : 0}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [styles.backdrop, isInitiallyOpen]
  );

  const handleChange = (index: number) => {
    setIsOpened(index !== -1);
    Keyboard.dismiss();
  };
  const handleCancelPress = () => {
    controller.close();
    onCancelButtonPress();
  };
  const handleClose = () => {
    if (isOpened) {
      setIsOpened(false);
      onClose();
    }
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
          index={isInitiallyOpen ? 0 : -1}
          snapPoints={[contentHeight]}
          enablePanDownToClose={true}
          bottomInset={insets.bottom + formatSize(8)}
          handleComponent={emptyComponent}
          backgroundComponent={emptyComponent}
          backdropComponent={renderBackdropComponent}
          onAnimate={handleAnimate}
          onChange={handleChange}
          onClose={handleClose}
        >
          <BottomSheetView style={styles.root}>
            {(isDefined(title) || isDefined(description)) && (
              <View style={styles.headerContainer}>
                {isDefined(title) && <Text style={styles.title}>{title}</Text>}
                {isDefined(description) && <Text style={styles.description}>{description}</Text>}
              </View>
            )}

            {children}

            <TouchableWithAnalytics
              Component={TouchableOpacity}
              testID={cancelButtonTestID}
              style={styles.cancelButton}
              onPress={handleCancelPress}
            >
              <Text style={styles.cancelButtonText}>{cancelButtonText}</Text>
            </TouchableWithAnalytics>
          </BottomSheetView>
        </GorhomBottomSheet>
      )}
    </Portal>
  );
};
