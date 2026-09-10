import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const usePrivateActivityItemStyles = createUseStyles(({ colors, typography }) => ({
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: formatSize(2),
    flexShrink: 1
  },
  addressText: {
    ...typography.numbersRegular13,
    color: colors.blue
  },
  memoText: {
    ...typography.numbersRegular13,
    color: colors.gray1
  }
}));
