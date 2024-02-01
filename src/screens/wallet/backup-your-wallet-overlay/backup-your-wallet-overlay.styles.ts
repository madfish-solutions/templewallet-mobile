import { StyleSheet } from 'react-native';

import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize, formatTextSize } from 'src/styles/format-size';

export const useBackupYourWalletOverlayStyles = createUseStyles(({ colors }) => ({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.black16,
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  root: {
    height: 'auto',
    paddingBottom: formatSize(2)
  },
  actionButton: {
    flexDirection: 'row',
    height: formatSize(56)
  },
  actionButtonText: {
    lineHeight: formatTextSize(22)
  },
  manualBackupButton: {
    borderBottomWidth: 0
  }
}));
