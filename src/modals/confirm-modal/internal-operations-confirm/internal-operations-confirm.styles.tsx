import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useInternalOpsConfirmStyles = createUseStyles(({ colors, typography }) => ({
  row: {
    display: 'flex',
    flexDirection: 'row'
  },
  feeView: {
    flexGrow: 1
  },
  feeLabel: {
    ...typography.caption11Regular
  },
  feeAmount: {
    ...typography.numbersRegular15,
    paddingRight: formatSize(4),
    color: colors.black
  },
  feeAmountUsd: {
    ...typography.numbersRegular15,
    color: colors.gray1
  },
  hidden: {
    display: 'none'
  },
  sliderIcon: {
    color: colors.gray1,
    width: formatSize(24),
    height: formatSize(24)
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
  feeInputForm: {
    marginRight: formatSize(24),
    flexGrow: 1
  }
}));
