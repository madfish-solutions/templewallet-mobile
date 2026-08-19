import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useAccountCardStyles = createUseStyles(({ colors, typography }) => ({
  card: {
    marginVertical: 0,
    paddingVertical: formatSize(12),
    borderRadius: formatSize(10)
  },
  container: {
    flex: 1,
    gap: formatSize(12)
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: formatSize(8)
  },
  name: {
    ...typography.body15Semibold,
    flex: 1,
    color: colors.black
  },
  headerTrailingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: formatSize(8)
  },
  headerTrailingContentFixed: {
    width: formatSize(150.5)
  },
  balance: {
    ...typography.numbersRegular15,
    color: colors.black
  },
  balanceRight: {
    textAlign: 'right'
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: formatSize(8)
  },
  address: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: formatSize(2),
    paddingRight: formatSize(4),
    paddingVertical: formatSize(2)
  },
  compactAddress: {
    maxWidth: formatSize(100)
  },
  addressText: {
    ...typography.caption13Regular,
    color: colors.blue
  },
  compactAddressText: {
    lineHeight: formatSize(18),
    flexShrink: 1
  }
}));
