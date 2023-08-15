import { StyleSheet } from 'react-native';

import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
export const useSwapDisclaimerOverlayStyles = createUseStyles(({ colors, typography }) => ({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.black16,
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  root: {
    height: 'auto',
    paddingBottom: formatSize(2),
    backgroundColor: colors.pageBG
  },
  paddingVertical: {
    paddingVertical: formatSize(24)
  },
  title: {
    ...typography.body20Bold,
    color: colors.black,
    textTransform: 'none'
  },
  description: {
    ...typography.body15Regular,
    color: colors.gray1,
    textAlign: 'center'
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkboxText: {
    ...typography.caption11Regular,
    color: colors.gray1
  },
  gotItButton: {
    height: formatSize(56),
    borderBottomWidth: 0,
    borderColor: colors.lines,
    paddingVertical: formatSize(16),
    backgroundColor: colors.white
  },
  gotItButtonTitle: {
    ...typography.body17Semibold,
    color: colors.peach
  }
}));
