import { StyleSheet } from 'react-native';

import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useBackupYourWalletOverlayStyles = createUseStyles(({ colors }) => ({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.black16,
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  root: {
    height: 'auto',
    paddingBottom: formatSize(8)
  },
  manualBackupButton: {
    borderBottomWidth: 0
  }
}));
