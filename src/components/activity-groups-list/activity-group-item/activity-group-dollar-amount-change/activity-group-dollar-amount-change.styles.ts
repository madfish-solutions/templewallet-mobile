import { createUseStyles } from '../../../../styles/create-use-styles';

export const useActivityGroupDollarAmountChangeStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    alignItems: 'flex-end',
    flexShrink: 1
  },
  positiveAmountText: {
    color: colors.adding
  },
  negativeAmountText: {
    color: colors.destructive
  },
  valueText: {
    ...typography.numbersRegular11,
    color: colors.gray1
  }
}));
