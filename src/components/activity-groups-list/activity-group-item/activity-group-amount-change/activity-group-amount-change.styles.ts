import { createUseStyles } from '../../../../styles/create-use-styles';

export const useActivityGroupAmountChangeStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    alignItems: 'flex-end',
    flexShrink: 1
  },
  amountWeight: {
    fontWeight: '400'
  },
  amountText15: {
    ...typography.numbersRegular15
  },
  amountText13: {
    ...typography.numbersRegular13
  },
  destructiveAmountText: {
    color: colors.destructive
  },
  positiveAmountText: {
    color: colors.adding
  },
  valueText: {
    ...typography.numbersRegular11,
    color: colors.gray1
  },
  black: {
    color: colors.black
  }
}));
