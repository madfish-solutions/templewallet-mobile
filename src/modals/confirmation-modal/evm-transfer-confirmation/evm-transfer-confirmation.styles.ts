import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useEvmTransferConfirmationStyles = createUseStyles(({ colors, typography }) => ({
  title: {
    ...typography.numbersRegular22,
    color: colors.black,
    textAlign: 'center'
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: formatSize(12),
    borderWidth: formatSize(1),
    borderColor: colors.lines,
    borderRadius: formatSize(12),
    backgroundColor: colors.cardBG
  },
  avatar: {
    width: formatSize(40),
    height: formatSize(40),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: formatSize(20),
    backgroundColor: colors.orange
  },
  avatarText: {
    ...typography.numbersRegular17,
    color: colors.white
  },
  accountInfo: {
    flex: 1,
    marginLeft: formatSize(8)
  },
  accountName: {
    ...typography.numbersRegular15,
    color: colors.black
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: formatSize(2)
  },
  addressText: {
    ...typography.numbersRegular11,
    color: colors.gray1,
    marginLeft: formatSize(4)
  },
  networkText: {
    ...typography.numbersRegular11,
    color: colors.gray1
  },
  summaryCard: {
    padding: formatSize(16),
    borderRadius: formatSize(12),
    backgroundColor: colors.cardBG
  },
  summaryLabel: {
    ...typography.numbersRegular11,
    color: colors.gray1
  },
  summaryValue: {
    ...typography.numbersRegular22,
    color: colors.black,
    marginTop: formatSize(2)
  },
  summaryAddress: {
    ...typography.numbersRegular15,
    color: colors.black,
    marginTop: formatSize(2)
  },
  feeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: formatSize(8)
  },
  feeValue: {
    ...typography.numbersRegular17,
    color: colors.black
  },
  customizeButton: {
    ...typography.numbersRegular13,
    color: colors.orange
  },
  presetLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  presetLabel: {
    ...typography.numbersRegular11,
    color: colors.gray1
  },
  gasLimitText: {
    ...typography.numbersRegular11,
    color: colors.gray1
  },
  errorText: {
    ...typography.numbersRegular11,
    color: colors.destructive,
    marginTop: formatSize(8)
  }
}));
