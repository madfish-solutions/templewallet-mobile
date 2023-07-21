import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize, formatTextSize } from 'src/styles/format-size';

export const useVestingPeriodDisclaimersStyles = createUseStylesMemoized(({ colors, typography }) => ({
  disclaimerDescriptionText: {
    ...typography.caption13Regular,
    letterSpacing: formatSize(-0.08),
    lineHeight: formatTextSize(18),
    color: colors.black
  },
  emphasized: {
    ...typography.caption13Semibold
  }
}));
