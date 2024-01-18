import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize, formatTextSize } from 'src/styles/format-size';

import { black } from '../../config/styles';
import { generateShadow } from '../../styles/generate-shadow';

export const useImportTypeItemStyles = createUseStylesMemoized(({ colors, typography }) => ({
  container: {
    ...generateShadow(1, black),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: formatSize(14),
    backgroundColor: colors.cardBG,
    padding: formatSize(16)
  },
  iconContainer: {
    width: formatSize(48),
    height: formatSize(48),
    borderRadius: formatSize(32),
    backgroundColor: colors.peach10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    ...typography.body15Semibold,
    color: colors.black,
    lineHeight: formatTextSize(20)
  },
  description: {
    ...typography.caption11Regular,
    color: colors.gray1,
    lineHeight: formatTextSize(13)
  }
}));
