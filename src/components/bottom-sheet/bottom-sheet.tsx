import { Portal } from '@gorhom/portal';
import React, { forwardRef, ReactNode, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import ReanimatedBottomSheet from 'reanimated-bottom-sheet';

import { EmptyFn } from '../../config/general';
import { BottomSheetStyles } from './bottom-sheet.styles';

interface Props {
  isOpen: boolean;
  overlayZIndex: number;
  height: number;
  renderContent: () => ReactNode;
  onCloseEnd: EmptyFn;
  onOverlayPress: EmptyFn;
}

export const BottomSheet = forwardRef<ReanimatedBottomSheet, Props>(
  ({ isOpen, overlayZIndex, height, renderContent, onCloseEnd, onOverlayPress }, ref) => {
    return (
      <Portal>
        {isOpen && (
          <Animated.View style={[BottomSheetStyles.overlay, { opacity, zIndex: overlayZIndex }]}>
            <TouchableOpacity style={BottomSheetStyles.overlayTouchable} onPress={onOverlayPress} />
          </Animated.View>
        )}

        <View style={StyleSheet.absoluteFillObject}>
          <ReanimatedBottomSheet
            ref={ref}
            snapPoints={[height, 0]}
            initialSnap={1}
            renderContent={renderContent}
            onOpenStart={handleOpenStart}
            onCloseStart={handleCloseStart}
            onCloseEnd={onCloseEnd}
          />
        </View>
      </Portal>
    );
  }
);
