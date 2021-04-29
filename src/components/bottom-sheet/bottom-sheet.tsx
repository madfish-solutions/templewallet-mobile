import { Portal } from '@gorhom/portal';
import React, { forwardRef, ReactNode, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import ReanimatedBottomSheet from 'reanimated-bottom-sheet';

import { ANIMATION_MAX_VALUE, ANIMATION_MIN_VALUE } from '../../config/animation';
import { EmptyFn } from '../../config/general';
import { conditionalStyle } from '../../utils/conditional-style';
import { BottomSheetStyles } from './bottom-sheet.styles';

interface Props {
  isOpen: boolean;
  contentHeight: number;
  overlayZIndex: number;
  contentZIndex: number;
  renderContent: () => ReactNode;

  onOverlayPress: EmptyFn;
  onCloseEnd: EmptyFn;
}

export const BottomSheet = forwardRef<ReanimatedBottomSheet, Props>(
  ({ isOpen, contentHeight, overlayZIndex, contentZIndex, renderContent, onOverlayPress, onCloseEnd }, ref) => {
    const animatedValue = useRef(new Animated.Value(ANIMATION_MIN_VALUE)).current;

    const opacity = animatedValue.interpolate({
      inputRange: [ANIMATION_MIN_VALUE, ANIMATION_MAX_VALUE],
      outputRange: [0.16, 0]
    });

    return (
      <Portal>
        <Animated.View
          style={[{ zIndex: overlayZIndex, opacity }, conditionalStyle(isOpen, BottomSheetStyles.overlayOpen)]}>
          <TouchableOpacity style={BottomSheetStyles.overlayTouchable} onPress={onOverlayPress} />
        </Animated.View>

        <View
          style={[
            { zIndex: contentZIndex },
            conditionalStyle(isOpen, { ...StyleSheet.absoluteFillObject, top: contentHeight })
          ]}>
          <ReanimatedBottomSheet
            ref={ref}
            snapPoints={[contentHeight, 0]}
            initialSnap={1}
            callbackNode={animatedValue}
            renderContent={renderContent}
            onCloseEnd={onCloseEnd}
          />
        </View>
      </Portal>
    );
  }
);
