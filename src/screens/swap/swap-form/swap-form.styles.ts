import { transparent } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useSwapFormStyles = createUseStyles(({ colors, typography }) => ({
  tokenListBalance: {
    ...typography.numbersRegular17,
    color: colors.black
  },
  tokenListDollarEquivalent: {
    ...typography.numbersRegular13,
    color: colors.gray1
  },
  outputAmountInput: {
    color: colors.black,
    backgroundColor: colors.input
  },
  outputInputContainer: {
    backgroundColor: colors.input,
    borderColor: transparent
  },
  disclaimerContainer: {
    marginTop: formatSize(4)
  },
  buttonContainer: {
    paddingHorizontal: formatSize(16),
    backgroundColor: colors.navigation
  }
}));
