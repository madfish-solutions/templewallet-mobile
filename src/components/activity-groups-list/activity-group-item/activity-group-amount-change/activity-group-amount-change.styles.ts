import { createUseStyles } from '../../../../styles/create-use-styles';

export const useActivityGroupAmountChangeStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    alignItems: 'flex-end',
    flexShrink: 1
  },
  amountText: {
    ...typography.numbersRegular17,
    color: colors.destructive
  },
  positiveAmountText: {
    color: colors.adding
  },
  negativeAmountText: {
    color: colors.destructive
  },
  valueText: {
    ...typography.numbersRegular11
  }
}));
