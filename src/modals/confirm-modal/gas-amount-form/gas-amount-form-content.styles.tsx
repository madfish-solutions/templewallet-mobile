import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useGasAmountFormContentStyles = createUseStyles(({ colors, typography }) => ({
  row: {
    flexDirection: 'row'
  },
  feeView: {
    flexGrow: 1
  },
  feeLabel: {
    ...typography.caption11Regular,
    color: colors.gray1
  },
  feeAmount: {
    ...typography.numbersRegular15,
    paddingRight: formatSize(4),
    color: colors.black
  },
  feeAmountUsd: {
    ...typography.numbersRegular11,
    color: colors.gray1
  },
  hidden: {
    display: 'none'
  },
  orangeIcon: {
    width: formatSize(16),
    height: formatSize(16),
    color: colors.orange
  },
  toggleSettingsButton: {
    padding: formatSize(6),
    backgroundColor: colors.orange10,
    borderRadius: formatSize(10)
  },
  shortFeeInputForm: {
    marginRight: formatSize(13),
    flexGrow: 1
  },
  feeInputForm: {
    marginRight: formatSize(24),
    flexGrow: 1
  }
}));
