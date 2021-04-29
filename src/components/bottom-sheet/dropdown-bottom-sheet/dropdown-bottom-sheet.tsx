import { Portal } from '@gorhom/portal';
import React, { FC, useEffect, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Animated from 'react-native-reanimated';
import ReanimatedBottomSheet from 'reanimated-bottom-sheet';

import { ANIMATION_MAX_VALUE, ANIMATION_MIN_VALUE } from '../../../config/animation';
import { black, orange } from '../../../config/styles';
import { zIndexEnum } from '../../../enums/z-index.enum';
import { conditionalStyle } from '../../../utils/conditional-style';
import { isDefined } from '../../../utils/is-defined';
import { BottomSheetStateProps } from '../bottom-sheet-state.props';
import { DropdownBottomSheetStyles } from './dropdown-bottom-sheet.styles';

export const DropdownBottomSheet: FC<BottomSheetStateProps> = ({ title, isOpen, onClose, children }) => {
  const ref = useRef<ReanimatedBottomSheet>(null);
  const animatedValue = useRef(new Animated.Value(ANIMATION_MIN_VALUE)).current;
  const contentHeight = 0.5 * useWindowDimensions().height;

  const opacity = animatedValue.interpolate({
    inputRange: [ANIMATION_MIN_VALUE, ANIMATION_MAX_VALUE],
    outputRange: [0.16, 0]
  });

  useEffect(() => void (isDefined(ref.current) && ref.current.snapTo(isOpen ? 0 : 1)), [isOpen]);

  const closeBottomSheet = () => void (isDefined(ref.current) && ref.current.snapTo(1));

  const renderContent = () => (
    <View style={DropdownBottomSheetStyles.root}>
      <View style={DropdownBottomSheetStyles.headerContainer}>
        <Text style={DropdownBottomSheetStyles.title}>{title}</Text>
      </View>
      <View style={DropdownBottomSheetStyles.contentContainer}>{children}</View>
      <View style={DropdownBottomSheetStyles.footerContainer}>
        <Button title="Cancel" color={orange} onPress={closeBottomSheet} />
      </View>
    </View>
  );

  return (
    <Portal>
      <Animated.View
        style={[
          { zIndex: zIndexEnum.DropdownBottomSheetOverlay, backgroundColor: black },
          conditionalStyle(isOpen, { ...StyleSheet.absoluteFillObject }),
          { opacity }
        ]}>
        <TouchableOpacity style={{ flex: 1 }} onPress={closeBottomSheet} />
      </Animated.View>

      <View
        style={[
          { zIndex: zIndexEnum.DropdownBottomSheetContent },
          conditionalStyle(isOpen, { ...StyleSheet.absoluteFillObject, top: contentHeight })
        ]}>
        <ReanimatedBottomSheet
          ref={ref}
          snapPoints={[contentHeight, 0]}
          initialSnap={1}
          callbackNode={animatedValue}
          onCloseEnd={onClose}
          renderContent={renderContent}
        />
      </View>
    </Portal>
  );
};
