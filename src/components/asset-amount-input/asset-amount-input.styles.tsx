import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useAssetAmountInputStyles = createUseStyles(({ typography, colors }) => ({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  mainInputWrapper: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: formatSize(8),
    backgroundColor: colors.input
  },
  mainInputWrapperError: {
    borderColor: colors.destructive,
    borderWidth: formatSize(1)
  },
  title: {
    ...typography.body15Semibold,
    color: colors.black
  },
  equivalent: {
    ...typography.numbersRegular11,
    color: colors.gray1
  },
  balanceTitle: {
    ...typography.caption11Regular,
    color: colors.gray1
  },
  balanceValue: {
    ...typography.numbersRegular11,
    color: colors.black
  },
  switcherOptionText: {
    ...typography.caption13Semibold
  },
  measurementTextsContainer: {
    flexDirection: 'row',
    height: 0
  },
  amountInput: {},
  amountInputContainer: {
    flexGrow: 1
  }
}));
