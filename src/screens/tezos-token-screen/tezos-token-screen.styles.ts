import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useTezosTokenScreenStyles = createUseStyles(({ colors, typography }) => ({
  balanceSplitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: formatSize(24),
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
    backgroundColor: colors.cardBG,
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
  rebalanceButton: {
    backgroundColor: colors.blue10,
    borderRadius: formatSize(10),
    padding: formatSize(6),
    transform: [{ rotate: '90deg' }]
  },
  sendAssetsListContainer: {
    padding: formatSize(8),
    backgroundColor: colors.pageBG,
    borderBottomWidth: formatSize(1),
    borderBottomColor: colors.lines
  }
}));
