import { StyleSheet } from 'react-native';

import { zIndexEnum } from '../../enums/z-index.enum';
import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useEnterPasswordStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: zIndexEnum.PasswordLockScreen
  },
  scrollViewContentContainer: {
    paddingTop: 0,
    paddingHorizontal: 0
  },
  bg: {
    flex: 1
  },
  imageView: {
    marginTop: formatSize(96),
    alignItems: 'center'
  },
  logo: {
    backgroundColor: colors.pageBG
  },
  footer: {
    paddingHorizontal: formatSize(16)
  },
  bottomText: {
    ...typography.caption13Regular,
    color: colors.gray1,
    textAlign: 'center'
  },
  passwordInputSection: {
    flexDirection: 'row'
  },
  passwordBiometry: {
    flexDirection: 'row',
    flexShrink: 0
  },
  passwordInputWrapper: {
    flexGrow: 1,
    flexShrink: 1
  }
}));
