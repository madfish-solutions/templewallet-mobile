import { black } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const useOnRampSmileButtonStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    ...generateShadow(1, black),
    borderRadius: formatSize(10),
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    width: formatSize(104),
    height: formatSize(90)
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
