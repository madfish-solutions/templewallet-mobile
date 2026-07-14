import GorhomBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
  TouchableOpacity
} from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { BackHandler, Keyboard, StyleProp, Text, useWindowDimensions, View, ViewStyle } from 'react-native';
import { useOrientationChange } from 'react-native-orientation-locker';
import { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { emptyFn } from 'src/config/general';
import { useAppLock } from 'src/shelter/app-lock/app-lock';
import { formatSize } from 'src/styles/format-size';
import { isDefined } from 'src/utils/is-defined';

import { IconNameV2Enum } from '../icon-v2/icon-name.enum';
import { TouchableIconV2 } from '../touchable-icon-v2';

import { useDropdownBottomSheetStyles } from './bottom-sheet.styles';
import { BottomSheetControllerProps } from './use-bottom-sheet-controller';

interface Props extends BottomSheetControllerProps {
  title?: string;
  description?: string;
  cancelButtonText?: string;
  onCancelButtonPress?: EmptyFn;
  cancelButtonTestID?: string;
  showCancelButton?: boolean;
  showCloseButton?: boolean;
  onClose?: EmptyFn;
  contentHeight: number;
  isInitiallyOpen?: boolean;
  rootStyle?: StyleProp<ViewStyle>;
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
  children,
  showCancelButton = true,
  showCloseButton = false,
  rootStyle
}) => {
  // hack that prevents rendering of GorhomBottomSheet component for locked app state,
  // as it loads heavy Reanimated 2 modules and application do not respond on gestures
  // TODO: try to remove this with @gorhom/bottom-sheet > 4.0.0
  const { isLocked } = useAppLock();
  const styles = useDropdownBottomSheetStyles();
  const insets = useSafeAreaInsets();
  const [isOpened, setIsOpened] = useState(false);

  const { height } = useWindowDimensions();
  const bottomInset = insets.bottom + formatSize(8);
  const containerLayoutState = useSharedValue({
    height: height - bottomInset,
    offset: {
      top: 0,
      right: 0,
      bottom: bottomInset,
      left: 0
    }
  });

  const renderBackdropComponent = useCallback(
    (props: PropsWithChildren<BottomSheetBackdropProps>) => (
      <BottomSheetBackdrop
        {...props}
        style={[props.style, styles.backdrop]}
        opacity={0.3}
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
  const handleClose = () => {
    if (isOpened) {
      setIsOpened(false);
      onClose();
    }
  };
  const handleClosePress = () => {
    controller.close();
    handleClose();
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
          containerStyle={styles.bottomSheetContainer}
          containerLayoutState={containerLayoutState}
          ref={controller.ref}
          index={isInitiallyOpen ? 0 : -1}
          snapPoints={[contentHeight]}
          enableDynamicSizing={false}
          enablePanDownToClose={true}
          bottomInset={bottomInset}
          handleComponent={null}
          backgroundComponent={null}
          backdropComponent={renderBackdropComponent}
          onChange={handleChange}
          onClose={handleClose}
        >
          <BottomSheetView style={rootStyle ?? styles.root}>
            {(isDefined(title) || isDefined(description)) && (
              <View style={styles.headerContainer}>
                {showCloseButton && <View style={styles.headerLeftSide} />}
                <View style={styles.headerTextsContainer}>
                  {isDefined(title) && <Text style={styles.title}>{title}</Text>}
                  {isDefined(description) && <Text style={styles.description}>{description}</Text>}
                </View>
                {showCloseButton && (
                  <View style={styles.headerRightSide}>
                    <TouchableIconV2
                      name={IconNameV2Enum.XBig}
                      onPress={handleClosePress}
                      size={formatSize(20)}
                      style={styles.closeButton}
                    />
                  </View>
                )}
              </View>
            )}

            {children}

            {showCancelButton && (
              <TouchableWithAnalytics
                Component={TouchableOpacity}
                testID={cancelButtonTestID}
                style={styles.cancelButton}
                onPress={handleCancelPress}
              >
                <Text style={styles.cancelButtonText}>{cancelButtonText}</Text>
              </TouchableWithAnalytics>
            )}
          </BottomSheetView>
        </GorhomBottomSheet>
      )}
    </Portal>
  );
};
