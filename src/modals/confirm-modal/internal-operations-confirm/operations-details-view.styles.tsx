import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useOpsDetailsStyles = createUseStyles(({ colors, typography }) => ({
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
  totalNumber: {
    ...typography.numbersMedium20
  },
  totalUsdNumber: {
    ...typography.numbersRegular17,
    color: colors.gray1
  },
  senderView: {
    display: 'flex',
    flexDirection: 'column'
  },
  arrowIcon: {
    width: formatSize(24),
    height: formatSize(24),
    color: colors.destructive
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
  previewTitleWrapper: {
    borderBottomWidth: formatSize(0.5),
    borderBottomColor: colors.lines,
    paddingBottom: formatSize(8),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  accountView: {
    display: 'flex',
    flexDirection: 'row'
  },
  shortInfoSection: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1
  },
  accountTitle: {
    marginLeft: formatSize(10)
  },
  balanceSection: {
    marginRight: formatSize(16)
  },
  balanceLabel: {
    ...typography.numbersRegular13,
    color: colors.black
  },
  unknownBakerLabel: {
    display: 'flex',
    flexDirection: 'row'
  },
  unknownBakerText: {
    marginRight: formatSize(4),
    ...typography.body15Regular
  }
}));
