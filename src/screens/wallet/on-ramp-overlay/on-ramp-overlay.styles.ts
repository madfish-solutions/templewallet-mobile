import { StyleSheet } from 'react-native';

import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
export const useOnRampOverlayStyles = createUseStyles(({ colors, typography }) => ({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.black16,
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  root: {
    height: 'auto',
    paddingBottom: formatSize(2),
    backgroundColor: colors.cardBG
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
  bold: {
    ...typography.body15Semibold
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: formatSize(24)
  },
  backgroundPeach: {
    backgroundColor: colors.peach
  },
  textWhite: {
    color: colors.white
  },
  notNowButton: {
    height: 'auto',
    borderBottomWidth: 0,
    borderTopWidth: formatSize(1),
    borderColor: colors.lines,
    paddingVertical: formatSize(16),
    backgroundColor: colors.cardBG
  },
  disclaimer: {
    ...typography.caption11Regular,
    color: colors.gray1
  },
  notNowButtonTitle: {
    ...typography.body17Semibold,
    color: colors.peach
  }
}));
