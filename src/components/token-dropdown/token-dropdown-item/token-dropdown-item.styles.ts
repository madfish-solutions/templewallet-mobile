import { createUseStyles } from '../../../styles/create-use-styles';

export const useTokenDropdownItemStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rightContainer: {
    flexDirection: 'row'
  },
  symbol: {
    ...typography.numbersRegular15,
    color: colors.black
  },
  name: {
    ...typography.numbersRegular11,
    color: colors.gray1
  },
  balance: {
    ...typography.numbersRegular15,
    color: colors.black,
    alignSelf: 'center'
  }
}));
