import { createUseStyles } from 'src/styles/create-use-styles';

export const useOperationPreviewAssetAmountsStyles = createUseStyles(({ colors, typography }) => ({
  amountToken: {
    ...typography.numbersRegular17,
    color: colors.destructive,
    textAlign: 'right'
  },
  amountDollar: {
    ...typography.numbersRegular11,
    color: colors.destructive,
    textAlign: 'right'
  }
}));
