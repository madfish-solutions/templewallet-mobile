import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize, formatTextSize } from 'src/styles/format-size';

export const useWithdrawFormStyles = createUseStylesMemoized(({ colors, typography }) => ({
  tokenSelectorTitle: {
    ...typography.body15Semibold,
    lineHeight: formatTextSize(20),
    letterSpacing: formatSize(-0.24),
    color: colors.black
  }
}));
