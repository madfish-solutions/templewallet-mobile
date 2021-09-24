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
  numericInput: {
    ...typography.numbersMedium22,
    flexGrow: 1,
    paddingLeft: formatSize(12),
    paddingVertical: formatSize(12),
    borderColor: colors.lines,
    borderRightWidth: formatSize(0.5)
  },
  dropdownContainer: {
    width: formatSize(126),
    paddingRight: formatSize(12),
    paddingVertical: formatSize(12)
  },
  lpDropdownContainer: {
    width: formatSize(162)
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
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
    alignSelf: 'flex-end'
  },
  balanceDescription: {
    ...typography.caption11Regular,
    color: colors.gray1
  },
  balanceValueText: {
    ...typography.numbersRegular11,
    color: colors.black
  }
}));
