import { Portal } from '@gorhom/portal';
import React, { FC, ReactNode, useRef, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated from 'react-native-reanimated';
import ReanimatedBottomSheet from 'reanimated-bottom-sheet';

import { ANIMATION_MAX_VALUE, ANIMATION_MIN_VALUE } from '../../config/animation';
import { zIndexEnum } from '../../enums/z-index.enum';
import { conditionalStyle } from '../../utils/conditional-style';
import { Touchable } from '../touchable/touchable';
import { BottomSheetStyles } from './bottom-sheet.styles';
import { BottomSheetControllerProps } from './use-bottom-sheet-controller';

interface Props extends BottomSheetControllerProps {
  contentHeight: number;
  overlayZIndex: zIndexEnum;
  contentZIndex: zIndexEnum;
  renderContent: () => ReactNode;
}

export const BottomSheet: FC<Props> = ({ controller, contentHeight, overlayZIndex, contentZIndex, renderContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const animatedValue = useRef(new Animated.Value(ANIMATION_MIN_VALUE)).current;
  const windowHeight = useWindowDimensions().height;

  const opacity = animatedValue.interpolate({
    inputRange: [ANIMATION_MIN_VALUE, ANIMATION_MAX_VALUE],
    outputRange: [0.16, 0]
  });

  const handleOpenStart = () => setIsOpen(true);
  const handleCloseEnd = () => setIsOpen(false);

  return (
    <Portal>
      <Animated.View
        style={[
          { zIndex: overlayZIndex, opacity },
          conditionalStyle(isOpen, {
            ...BottomSheetStyles.overlayOpen,
            height: windowHeight
          })
        ]}>
        {isOpen && <Touchable style={BottomSheetStyles.overlayTouchable} onPress={controller.close} />}
      </Animated.View>

      <View
        style={[
          { zIndex: contentZIndex },
          conditionalStyle(isOpen, {
            ...StyleSheet.absoluteFillObject,
            top: windowHeight - contentHeight,
            height: contentHeight
          })
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
