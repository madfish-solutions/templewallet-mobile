import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useEarnOpportunityStatsItemStyles = createUseStylesMemoized(({ colors, typography }) => ({
  root: {
    flex: 1
  },
  title: {
    ...typography.caption11Regular,
    letterSpacing: formatSize(0.07),
    color: colors.gray1
  },
  fiatEquity: {
    ...typography.numbersRegular11,
    letterSpacing: formatSize(0.07),
    color: colors.gray1
  },
  loader: {
    ...typography.numbersRegular17,
    letterSpacing: formatSize(-0.41),
    color: colors.black
  }
}));
