import { BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import React from 'react';
import { View } from 'react-native';

import { useBottomSheetBackgroundStyles } from './bottom-sheet-background.styles';

export const BottomSheetBackground = ({ style }: BottomSheetBackgroundProps) => {
  const styles = useBottomSheetBackgroundStyles();

  return <View style={[style, styles.root]} />;
};
