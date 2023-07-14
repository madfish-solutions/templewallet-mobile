import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useSwapRouteAmountsStyles = createUseStylesMemoized(({ colors, typography }) => ({
  amountsContainer: {
    width: formatSize(44)
  },
  amount: {
    ...typography.caption13Regular,
    color: colors.gray2
  },
  percentage: {
    ...typography.caption13Regular,
    color: colors.blue
  }
}));
