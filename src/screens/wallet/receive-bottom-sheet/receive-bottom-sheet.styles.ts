import { StyleSheet } from 'react-native';

import { step } from '../../../config/styles';

export const ReceiveBottomSheetStyles = StyleSheet.create({
  title: {
    fontSize: 4 * step,
    textAlign: 'center',
    marginBottom: 2 * step
  },
  qrCodeContainer: {
    alignSelf: 'center',
    marginVertical: 6 * step
  }
});
