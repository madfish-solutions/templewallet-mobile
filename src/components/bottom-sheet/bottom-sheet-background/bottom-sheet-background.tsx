import { BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { View } from 'react-native';

import { useBottomSheetBackgroundStyles } from './bottom-sheet-background.styles';

export const BottomSheetBackground: FC<BottomSheetBackgroundProps> = ({ style }) => {
  const styles = useBottomSheetBackgroundStyles();

  return <View style={[style, styles.root]} />;
};
