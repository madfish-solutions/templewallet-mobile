import { Portal } from '@gorhom/portal';
import React, { FC, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Animated from 'react-native-reanimated';
import ReanimatedBottomSheet from 'reanimated-bottom-sheet';

import { ANIMATION_MAX_VALUE, ANIMATION_MIN_VALUE } from '../../../config/animation';
import { black, step } from '../../../config/styles';
import { zIndexEnum } from '../../../enums/z-index.enum';
import { conditionalStyle } from '../../../utils/conditional-style';
import { isDefined } from '../../../utils/is-defined';
import { BottomSheetStateProps } from '../bottom-sheet-state.props';
import ModalBottomSheetCloseIcon from './modal-bottom-sheet-close-icon.svg';
import { closeIconSize, ModalBottomSheetStyles } from './modal-bottom-sheet.styles';

export const ModalBottomSheet: FC<BottomSheetStateProps> = ({ title, isOpen, onClose, children }) => {
  const ref = useRef<ReanimatedBottomSheet>(null);
  const animatedValue = useRef(new Animated.Value(ANIMATION_MIN_VALUE)).current;
  const contentHeight = useWindowDimensions().height - 20 * step;

  const opacity = animatedValue.interpolate({
    inputRange: [ANIMATION_MIN_VALUE, ANIMATION_MAX_VALUE],
    outputRange: [0.16, 0]
  });

  useEffect(() => void (isDefined(ref.current) && ref.current.snapTo(isOpen ? 0 : 1)), [isOpen]);

  const closeBottomSheet = () => void (isDefined(ref.current) && ref.current.snapTo(1));

  const renderContent = () => (
    <View style={ModalBottomSheetStyles.root}>
      <View style={ModalBottomSheetStyles.headerContainer}>
        <View style={ModalBottomSheetStyles.iconSubstitute} />
        <Text style={ModalBottomSheetStyles.title}>{title}</Text>
        <TouchableOpacity onPress={closeBottomSheet}>
          <ModalBottomSheetCloseIcon width={closeIconSize} height={closeIconSize} />
        </TouchableOpacity>
      </View>
      <View style={ModalBottomSheetStyles.contentContainer}>{children}</View>
    </View>
  );

  return (
    <Portal>
      <Animated.View
        style={[
          { zIndex: zIndexEnum.ModalBottomSheetOverlay, backgroundColor: black },
          conditionalStyle(isOpen, { ...StyleSheet.absoluteFillObject }),
          { opacity }
        ]}>
        <TouchableOpacity style={{ flex: 1 }} onPress={closeBottomSheet} />
      </Animated.View>

      <View
        style={[
          { zIndex: zIndexEnum.ModalBottomSheetContent },
          conditionalStyle(isOpen, { ...StyleSheet.absoluteFillObject, top: contentHeight })
        ]}>
        <ReanimatedBottomSheet
          ref={ref}
          snapPoints={[contentHeight, 0]}
          initialSnap={1}
          callbackNode={animatedValue}
          renderContent={renderContent}
          onCloseEnd={onClose}
        />
      </View>
    </Portal>
  );
};
