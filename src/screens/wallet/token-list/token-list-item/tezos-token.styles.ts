import { DEFAULT_BORDER_WIDTH } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useTezosTokenBalanceSplitStyles = createUseStyles(({ colors, typography }) => ({
  outerContainer: {
    borderBottomWidth: DEFAULT_BORDER_WIDTH,
    borderColor: colors.lines
  },
  tokenRowNoBorder: {
    borderBottomWidth: 0
  },
  balanceSplitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: formatSize(16),
    paddingTop: formatSize(4),
    paddingBottom: formatSize(8),
    gap: formatSize(8)
  },
  balancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: formatSize(1),
    borderColor: colors.lines,
    borderRadius: formatSize(56),
    paddingHorizontal: formatSize(12),
    paddingVertical: formatSize(8),
    backgroundColor: colors.cardBG
  },
  balancePillTextContainer: {
    flexDirection: 'row',
    gap: formatSize(4)
  },
  balancePillText: {
    ...typography.numbersRegular11,
    color: colors.gray1
  },
  balancePillTextNumber: {
    ...typography.numbersRegular11,
    color: colors.black
  },
  infoButton: {
    marginLeft: 'auto'
  }
}));
