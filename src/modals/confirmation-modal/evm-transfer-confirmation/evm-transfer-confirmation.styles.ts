import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
export const useEvmTransferConfirmationStyles = createUseStyles(({ colors, typography }) => ({
  feeInfoItem: {
    width: '100%'
  },
  errorText: {
    ...typography.numbersRegular11,
    color: colors.destructive,
    marginTop: formatSize(8)
  }
}));
