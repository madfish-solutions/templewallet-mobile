import { StyleSheet } from 'react-native';

import { pageBgColor, step } from '../../../config/styles';

export const BottomSheetBackgroundStyles = StyleSheet.create({
  root: {
    backgroundColor: pageBgColor,
    marginTop: 2 * step
  }
});
