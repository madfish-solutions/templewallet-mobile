import { createUseStyles } from 'src/styles/create-use-styles';

export const useActivityGroupAmountChangeStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    alignItems: 'flex-end'
  },
  amountText: {
    ...typography.numbersRegular17,
    color: colors.destructive
  },
  positiveAmountText: {
    color: colors.adding
  }
}));
