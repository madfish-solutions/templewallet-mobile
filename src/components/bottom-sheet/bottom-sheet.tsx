import { Portal } from '@gorhom/portal';
import React, { FC, ReactNode, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import ReanimatedBottomSheet from 'reanimated-bottom-sheet';

import { ANIMATION_MAX_VALUE, ANIMATION_MIN_VALUE } from '../../config/animation';
import { conditionalStyle } from '../../utils/conditional-style';
import { BottomSheetStyles } from './bottom-sheet.styles';
import { BottomSheetControllerProps } from './use-bottom-sheet-controller';

interface Props extends BottomSheetControllerProps {
  contentHeight: number;
  overlayZIndex: number;
  contentZIndex: number;
  renderContent: () => ReactNode;
}

export const BottomSheet: FC<Props> = ({ controller, contentHeight, overlayZIndex, contentZIndex, renderContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const animatedValue = useRef(new Animated.Value(ANIMATION_MIN_VALUE)).current;

  const opacity = animatedValue.interpolate({
    inputRange: [ANIMATION_MIN_VALUE, ANIMATION_MAX_VALUE],
    outputRange: [0.16, 0]
  });

  const handleOpenStart = () => setIsOpen(true);
  const handleCloseEnd = () => setIsOpen(false);

  return (
    <Portal>
      <Animated.View
        style={[{ zIndex: overlayZIndex, opacity }, conditionalStyle(isOpen, BottomSheetStyles.overlayOpen)]}>
        <TouchableOpacity style={BottomSheetStyles.overlayTouchable} onPress={controller.close} />
      </Animated.View>

      <View
        style={[
          { zIndex: contentZIndex },
          conditionalStyle(isOpen, { ...StyleSheet.absoluteFillObject, top: contentHeight })
        ]}>
        <ReanimatedBottomSheet
          ref={controller.ref}
          snapPoints={[contentHeight, 0]}
          initialSnap={1}
          callbackNode={animatedValue}
          renderContent={renderContent}
          onOpenStart={handleOpenStart}
          onCloseEnd={handleCloseEnd}
        />
      </View>
    </Portal>
  );
};
