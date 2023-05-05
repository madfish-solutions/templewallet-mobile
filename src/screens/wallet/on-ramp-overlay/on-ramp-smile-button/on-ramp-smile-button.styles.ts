import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

import { black } from '../../../../config/styles';
import { generateShadow } from '../../../../styles/generate-shadow';

export const useOnRampSmileButtonStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    ...generateShadow(1, black),
    paddingVertical: formatSize(16),
    paddingHorizontal: formatSize(32),
    borderRadius: formatSize(10),
    backgroundColor: colors.cardBG,
    justifyContent: 'center',
    alignItems: 'center'
  },
  smile: {
    fontSize: formatSize(28)
  },
  title: {
    ...typography.numbersMedium17,
    color: colors.peach
  },
  disabled: {
    backgroundColor: colors.pageBG
  },
  disabledTitle: {
    color: colors.gray4
  }
}));
