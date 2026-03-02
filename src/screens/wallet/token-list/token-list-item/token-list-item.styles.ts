import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useTokenListItemStyles = createUseStyles(({ colors, typography }) => ({
  rightContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    maxWidth: formatSize(150)
  },
  balanceText: {
    ...typography.numbersRegular15,
    color: colors.black
  },
  valueText: {
    ...typography.numbersRegular11,
    color: colors.gray1
  },
  container: {
    marginLeft: formatSize(16)
  }
}));
