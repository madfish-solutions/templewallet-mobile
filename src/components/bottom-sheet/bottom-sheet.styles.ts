import { StyleSheet } from 'react-native';

import { black } from '../../config/styles';

export const BottomSheetStyles = StyleSheet.create({
  overlayOpen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: black
  },
  overlayTouchable: {
    flex: 1
  }
});
