import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize, formatTextSize } from 'src/styles/format-size';

export const useStakeFormStyles = createUseStylesMemoized(({ colors, typography }) => ({
  depositPrompt: {
    ...typography.caption13Regular,
    letterSpacing: formatTextSize(-0.08),
    color: colors.gray1,
    paddingHorizontal: formatSize(4)
  },
  balanceText: {
    color: colors.black
  },
  listItem: {
    flexDirection: 'row'
  },
  listItemBullet: {
    ...typography.caption13Regular,
    letterSpacing: formatTextSize(-0.08),
    lineHeight: formatTextSize(18),
    width: formatSize(20),
    textAlign: 'center',
    color: colors.black
  },
  listItemText: {
    ...typography.caption13Regular,
    letterSpacing: formatTextSize(-0.08),
    lineHeight: formatTextSize(18),
    flex: 1,
    color: colors.black
  },
  acceptRisksText: {
    ...typography.body15Semibold,
    letterSpacing: formatTextSize(-0.24),
    color: colors.black,
    marginLeft: formatSize(10)
  }
}));
