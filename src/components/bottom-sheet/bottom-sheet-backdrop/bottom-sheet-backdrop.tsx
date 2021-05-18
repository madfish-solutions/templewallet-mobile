import { BottomSheetBackdropProps, TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC, useMemo, useState } from 'react';
import Animated, { call, Extrapolate, interpolate } from 'react-native-reanimated';

import { ANIMATION_MAX_VALUE, ANIMATION_MIN_VALUE } from '../../../config/animation';
import { EmptyFn } from '../../../config/general';
import { useBottomSheetBackdropStyles } from './bottom-sheet-backdrop.styles';

interface Props extends BottomSheetBackdropProps {
  onPress: EmptyFn;
}

export const BottomSheetBackdrop: FC<Props> = ({ animatedIndex, style, onPress }) => {
  const styles = useBottomSheetBackdropStyles();
  const [isOpen, setIsOpen] = useState(false);
  const opacity = useMemo(
    () =>
      interpolate(animatedIndex, {
        inputRange: [ANIMATION_MIN_VALUE, ANIMATION_MAX_VALUE],
        outputRange: [0, 0.16],
        extrapolate: Extrapolate.CLAMP
      }),
    [animatedIndex]
  );
  const containerStyle = useMemo(() => [style, styles.container, { opacity }], [style, opacity]);

  Animated.useCode(() => call([opacity], ([val]) => setIsOpen(val !== 0)), [opacity]);

  return isOpen ? (
    <Animated.View style={containerStyle}>
      <TouchableOpacity style={styles.touchable} onPress={onPress} />
    </Animated.View>
  ) : null;
};
