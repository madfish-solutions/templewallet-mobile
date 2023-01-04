import { transparent } from '../../config/styles';
import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useAssetAmountInputStyles = createUseStyles(({ colors, typography }) => ({
  headerContainer: {
    height: formatSize(28),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  inputContainer: {
    flexDirection: 'row',
    borderRadius: formatSize(8),
    backgroundColor: colors.input,
    borderWidth: formatSize(1),
    borderColor: transparent
  },
  inputContainerError: {
    borderColor: colors.destructive
  },
  inputPadding: {
    width: formatSize(12)
  },
  disabledPadding: {
    backgroundColor: colors.lines,
    borderBottomLeftRadius: formatSize(8),
    borderTopLeftRadius: formatSize(8)
  },
  numericInput: {
    ...typography.numbersMedium22,
    color: colors.black,
    flexGrow: 1,
    flexShrink: 1,
    paddingTop: formatSize(12),
    paddingBottom: formatSize(12),
    borderColor: colors.lines,
    borderRightWidth: formatSize(0.5)
  },
  maxButtonText: {
    ...typography.tagline13Tag,
    color: colors.orange
  },
  disabledInput: {
    ...typography.numbersMedium22,
    color: colors.gray2,
    backgroundColor: colors.lines,
    borderColor: colors.lines
  },
  dropdownContainer: {
    width: formatSize(126),
    paddingRight: formatSize(12),
    paddingVertical: formatSize(12)
  },
  quoteContainer: {
    width: formatSize(126),
    paddingRight: formatSize(12)
  },
  lpDropdownContainer: {
    width: formatSize(162)
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  equivalentValueText: {
    ...typography.numbersRegular11,
    color: colors.gray1
  },
  balanceContainer: {
    alignSelf: 'flex-start'
  },
  balanceRow: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center'
  },
  balanceDescription: {
    ...typography.numbersRegular11,
    color: colors.gray1
  },
  balanceValueText: {
    ...typography.numbersRegular11,
    color: colors.black
  }
}));
