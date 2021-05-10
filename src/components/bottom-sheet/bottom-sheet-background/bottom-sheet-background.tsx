import { BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import React from 'react';
import { View } from 'react-native';

import { BottomSheetBackgroundStyles } from './bottom-sheet-background.styles';

export const BottomSheetBackground = ({ style }: BottomSheetBackgroundProps) => {
  return <View style={[style, BottomSheetBackgroundStyles.root]} />;
};
