import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useTokenDropdownItemStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: formatSize(40)
  },
  infoContainer: {
    flexGrow: 1,
    flexShrink: 1
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
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
  fullWidthName: {
    flexGrow: 1
  },
  balance: {
    ...typography.numbersRegular15,
    color: colors.black,
    alignSelf: 'center'
  },
  dollarEquivalent: {
    ...typography.numbersRegular11,
    color: colors.gray1,
    alignSelf: 'flex-end'
  },
  actionIconSubstitute: {
    marginRight: formatSize(24)
  }
}));
