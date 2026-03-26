import { DEFAULT_BORDER_WIDTH } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const usePrivateActivityItemStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    marginLeft: formatSize(16),
    borderBottomColor: colors.lines,
    borderBottomWidth: DEFAULT_BORDER_WIDTH,
    paddingRight: formatSize(16)
  },
  upperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1
  },
  typeText: {
    ...typography.caption13Regular,
    color: colors.black,
    flexShrink: 1
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  addressText: {
    height: formatSize(24)
  },
  amountContainer: {
    alignItems: 'flex-end'
  },
  amountText: {
    ...typography.numbersRegular17,
    color: colors.destructive
  },
  positiveAmountText: {
    color: colors.adding
  },
  negativeAmountText: {
    color: colors.destructive
  },
  lowerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  memoText: {
    ...typography.numbersRegular11,
    color: colors.gray2
  },
  dollarText: {
    ...typography.numbersRegular11
  }
}));
