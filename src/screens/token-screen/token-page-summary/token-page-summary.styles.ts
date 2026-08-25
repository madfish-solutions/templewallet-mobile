import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useTokenPageSummaryStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    paddingHorizontal: formatSize(16),
    paddingTop: formatSize(16),
    paddingBottom: formatSize(16),
    backgroundColor: colors.navigation
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  identityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    gap: formatSize(8)
  },
  identityTexts: {
    flexShrink: 1
  },
  identityTitle: {
    ...typography.numbersMedium15,
    color: colors.black
  },
  networkText: {
    ...typography.numbersRegular13,
    color: colors.gray1
  },
  balanceText: {
    ...typography.numbersMedium28,
    color: colors.black,
    marginTop: formatSize(16)
  },
  fiatText: {
    ...typography.numbersRegular13,
    color: colors.gray1,
    marginTop: formatSize(2)
  },
  balanceSplitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: formatSize(16),
    gap: formatSize(8)
  },
  rebalanceButton: {
    backgroundColor: colors.blue10,
    borderRadius: formatSize(10),
    padding: formatSize(6),
    transform: [{ rotate: '90deg' }]
  },
  actionsRow: {
    marginTop: formatSize(16)
  },
  actionButtons: {
    marginBottom: 0
  },
  tabsRow: {
    paddingHorizontal: formatSize(16),
    paddingVertical: formatSize(8)
  },
  scamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: formatSize(4),
    paddingHorizontal: formatSize(12),
    paddingVertical: formatSize(6),
    borderRadius: formatSize(56),
    backgroundColor: colors.destructive
  },
  scamText: {
    ...typography.caption13Semibold,
    color: colors.white
  }
}));
