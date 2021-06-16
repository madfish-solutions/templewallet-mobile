import { StyleSheet } from 'react-native';

import { zIndexEnum } from '../../enums/z-index.enum';
import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useEnterPasswordStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: zIndexEnum.PasswordLockScreen
  },
  imageView: {
    marginTop: formatSize(108),
    marginBottom: formatSize(90),
    alignItems: 'center',
    justifyContent: 'center'
  },
  noQuoteImageView: {
    flexGrow: 1
  },
  quoteView: {
    flexGrow: 1,
    justifyContent: 'center',
    marginHorizontal: formatSize(4),
    marginBottom: formatSize(18),
    alignItems: 'stretch'
  },
  bottomText: {
    ...typography.caption13Regular,
    color: colors.gray1,
    textAlign: 'center'
  }
}));
