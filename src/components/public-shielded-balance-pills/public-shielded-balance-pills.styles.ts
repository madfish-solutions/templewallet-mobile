import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const usePublicShieldedBalancePillsStyles = createUseStyles(({ colors, typography }) => ({
  balancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: formatSize(4),
    borderWidth: formatSize(0.5),
    borderColor: colors.lines,
    borderRadius: formatSize(56),
    paddingHorizontal: formatSize(12),
    paddingVertical: formatSize(10),
    backgroundColor: colors.pageBG
  },
  balancePillText: {
    ...typography.numbersRegular11,
    color: colors.gray1
  },
  balancePillTextNumber: {
    ...typography.numbersRegular11,
    color: colors.black
  }
}));
