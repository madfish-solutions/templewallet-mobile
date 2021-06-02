import { createUseStyles } from '../../../../styles/create-use-styles';

export const useTokenListItemStyles = createUseStyles(({ colors, typography }) => ({
  rightContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end'
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
