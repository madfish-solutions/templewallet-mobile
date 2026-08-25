import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useWcTransactionPreviewStyles = createUseStyles(({ colors, typography }) => ({
  amountToken: {
    ...typography.numbersRegular17,
    color: colors.destructive,
    textAlign: 'right'
  },
  amountTokenSuccess: {
    ...typography.numbersRegular17,
    color: colors.adding,
    textAlign: 'right'
  },
  amountDollar: {
    ...typography.numbersRegular11,
    color: colors.destructive,
    textAlign: 'right'
  },
  amountDollarAdding: {
    ...typography.numbersRegular11,
    color: colors.adding,
    textAlign: 'right'
  },
  amountsColumn: {
    alignItems: 'flex-end'
  },
  approvalAmountToken: {
    color: colors.black
  },
  loader: {
    height: formatSize(96),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  }
}));
