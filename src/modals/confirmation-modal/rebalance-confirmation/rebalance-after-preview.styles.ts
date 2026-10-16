import { createUseStyles } from 'src/styles/create-use-styles';

export const useRebalanceAfterPreviewStyles = createUseStyles(({ colors, typography }) => ({
  creditAmount: {
    ...typography.numbersRegular17,
    color: colors.adding,
    textAlign: 'right'
  },
  creditDollar: {
    ...typography.numbersRegular11,
    color: colors.adding,
    textAlign: 'right'
  }
}));
