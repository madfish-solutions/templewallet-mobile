import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useInternalOpsConfirmStyles = createUseStyles(({ colors, typography }) => ({
  row: {
    display: 'flex',
    flexDirection: 'row'
  },
  sendAddressesLeftHalf: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row'
  },
  recipientView: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  arrowContainer: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  senderView: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    ...typography.body15Semibold,
    color: colors.gray1,
    marginBottom: formatSize(4)
  },
  accountLabel: {
    ...typography.caption13Semibold,
    color: colors.black,
    marginBottom: formatSize(4)
  },
  arrowIcon: {
    width: formatSize(24),
    height: formatSize(24),
    color: colors.destructive
  },
  totalNumber: {
    ...typography.numbersMedium20
  },
  totalUsdNumber: {
    ...typography.numbersRegular17,
    color: colors.gray1
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
  amountLabelWrapper: {
    borderBottomWidth: formatSize(0.5),
    borderBottomColor: colors.lines,
    paddingBottom: formatSize(8),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
