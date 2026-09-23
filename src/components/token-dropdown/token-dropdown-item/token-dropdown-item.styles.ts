import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize, formatTextSize } from 'src/styles/format-size';

export const useTokenDropdownItemStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: formatSize(40)
  },
  compactContainer: {
    height: formatSize(44)
  },
  iconContainer: {
    position: 'relative'
  },
  iconVisualContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
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
  compactSymbol: {
    ...typography.numbersRegular17,
    lineHeight: formatTextSize(22)
  },
  name: {
    ...typography.numbersRegular11,
    color: colors.gray1
  },
  compactName: {
    ...typography.numbersRegular13,
    lineHeight: formatTextSize(18)
  },
  fullWidthName: {
    flexGrow: 1
  },
  balanceWrapper: {
    alignSelf: 'center'
  },
  balance: {
    ...typography.numbersRegular15,
    color: colors.black
  },
  dollarEquivalentWrapper: {
    alignSelf: 'flex-end'
  },
  dollarEquivalent: {
    ...typography.numbersRegular11,
    color: colors.gray1
  },
  actionIconSubstitute: {
    marginRight: formatSize(24)
  }
}));
