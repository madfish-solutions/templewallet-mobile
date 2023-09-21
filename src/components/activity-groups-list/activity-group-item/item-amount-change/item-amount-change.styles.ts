import { createUseStyles } from 'src/styles/create-use-styles';

export const useActivityGroupDollarAmountChangeStyles = createUseStyles(({ colors }) => ({
  container: {
    alignItems: 'flex-end',
    flexShrink: 1
  },
  positiveAmountText: {
    color: colors.adding
  },
  negativeAmountText: {
    color: colors.destructive
  }
}));
