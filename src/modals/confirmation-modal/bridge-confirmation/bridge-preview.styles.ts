import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useBridgePreviewStyles = createUseStyles(({ colors, typography }) => ({
  creditAmount: {
    ...typography.numbersRegular17,
    color: colors.adding,
    textAlign: 'right'
  },
  creditFiatValue: {
    ...typography.numbersRegular11,
    color: colors.adding,
    textAlign: 'right'
  },
  notes: {
    marginTop: formatSize(8)
  }
}));
