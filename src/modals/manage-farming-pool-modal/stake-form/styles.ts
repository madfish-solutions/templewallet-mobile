import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useStakeFormStyles = createUseStyles(({ colors, typography }) => ({
  depositPrompt: {
    ...typography.caption13Regular,
    letterSpacing: formatSize(-0.08),
    color: colors.gray1
  },
  formContainer: {
    flex: 1
  },
  balanceText: {
    color: colors.black
  }
}));
