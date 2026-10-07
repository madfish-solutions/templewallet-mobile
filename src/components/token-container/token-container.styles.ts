import { StyleSheet } from 'react-native';

import { basicLightColors } from 'src/styles/colors';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useTokenContainerStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: formatSize(16),
    paddingVertical: formatSize(8),
    columnGap: formatSize(12)
  },
  leftContainer: {
    flexDirection: 'row',
    flex: 1,
    minWidth: 0
  },
  infoContainer: {
    justifyContent: 'center',
    flex: 1,
    minWidth: 0,
    rowGap: formatSize(2)
  },
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  symbolText: {
    ...typography.numbersRegular17,
    color: colors.black,
    letterSpacing: -0.41,
    lineHeight: formatSize(22)
  },
  apyContainer: {
    backgroundColor: colors.blue,
    borderRadius: formatSize(8),
    paddingHorizontal: formatSize(4),
    paddingVertical: formatSize(2),
    marginLeft: formatSize(4)
  },
  apyText: {
    ...typography.tagline11Tag,
    color: basicLightColors.white
  },
  nameText: {
    ...typography.numbersRegular13,
    color: colors.gray1,
    letterSpacing: -0.08,
    lineHeight: formatSize(18)
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginRight: formatSize(16),
    backgroundColor: colors.lines
  }
}));
