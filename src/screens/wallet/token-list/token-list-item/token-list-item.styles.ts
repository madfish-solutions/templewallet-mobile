import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

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
  }
}));
