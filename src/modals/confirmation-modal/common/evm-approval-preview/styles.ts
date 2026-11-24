import { createUseStyles } from 'src/styles/create-use-styles';

export const useEvmApprovalPreviewStyles = createUseStyles(({ colors, typography }) => ({
  amountToken: {
    ...typography.numbersRegular17,
    color: colors.destructive,
    textAlign: 'right'
  },
  approvalAmountToken: {
    color: colors.black
  }
}));
