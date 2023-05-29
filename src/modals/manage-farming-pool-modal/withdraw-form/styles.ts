import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useWithdrawFormStyles = createUseStyles(({ colors, typography }) => ({
  formContainer: {
    flex: 1
  },
  tokenSelectorTitle: {
    ...typography.body15Semibold,
    lineHeight: formatSize(20),
    letterSpacing: formatSize(-0.24),
    color: colors.black
  }
}));
