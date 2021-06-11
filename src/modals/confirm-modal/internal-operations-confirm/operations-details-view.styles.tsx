import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useOpsDetailsStyles = createUseStyles(({ colors, typography }) => ({
  row: {
    flexDirection: 'row'
  },
  sendAddressesLeftHalf: {
    flexGrow: 1,
    flexDirection: 'row'
  },
  recipientView: {
    alignItems: 'flex-end'
  },
  arrowContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  totalNumber: {
    ...typography.numbersMedium20,
    color: colors.black
  },
  totalUsdNumber: {
    ...typography.numbersRegular17,
    color: colors.gray1
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
  delegationAccountLabel: {
    ...typography.caption13Semibold,
    color: colors.black
  },
  previewTitleWrapper: {
    borderBottomWidth: formatSize(0.5),
    borderBottomColor: colors.lines,
    paddingBottom: formatSize(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  accountView: {
    flexDirection: 'row'
  },
  shortInfoSection: {
    flexDirection: 'row',
    flexGrow: 1
  },
  accountTitle: {
    marginLeft: formatSize(10),
    justifyContent: 'space-between'
  },
  balanceSection: {
    marginRight: formatSize(16),
    justifyContent: 'flex-end'
  },
  balanceLabel: {
    ...typography.numbersRegular13,
    color: colors.black
  },
  unknownBakerLabel: {
    flexDirection: 'row'
  },
  unknownBakerText: {
    marginRight: formatSize(4),
    ...typography.body15Regular,
    color: colors.black
  }
}));
