import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useTopUpTokenDropdownItemStyles = createUseStyles(({ colors, typography }) => ({
  infoContainer: {
    flexGrow: 1,
    flexShrink: 1
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  height40: {
    height: formatSize(40)
  },
  justifySpaceBetween: {
    justifyContent: 'space-between'
  },
  textRegular17: {
    ...typography.numbersRegular17,
    color: colors.black
  },
  textRegular15: {
    ...typography.numbersRegular15,
    color: colors.black
  },
  textRegular11: {
    ...typography.numbersRegular11,
    color: colors.gray2
  },
  textRegular13: {
    ...typography.numbersRegular13,
    flex: 1,
    color: colors.gray1
  }
}));
