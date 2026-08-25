import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useActivityOperationRowStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: formatSize(16),
    paddingVertical: formatSize(10)
  },
  infoContainer: {
    flex: 1,
    marginLeft: formatSize(8),
    gap: formatSize(3)
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1
  },
  titleText: {
    ...typography.numbersRegular17,
    color: colors.black
  },
  shieldIcon: {
    marginRight: formatSize(2)
  },
  statusContainer: {
    marginLeft: formatSize(4)
  },
  rightContainer: {
    alignItems: 'flex-end',
    marginLeft: formatSize(8),
    flexShrink: 1,
    maxWidth: '50%'
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  symbolText: {
    flexShrink: 0
  },
  amountText: {
    ...typography.numbersRegular17,
    color: colors.black
  },
  positiveAmountText: {
    color: colors.adding
  },
  noteText: {
    ...typography.numbersRegular13,
    color: colors.gray1
  }
}));
