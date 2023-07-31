import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useActivityGroupItemStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    paddingVertical: formatSize(16),
    paddingRight: formatSize(16)
  },
  flex: {
    flex: 1
  },
  card: {
    marginTop: formatSize(12),
    paddingHorizontal: formatSize(12),
    borderRadius: formatSize(8),
    backgroundColor: colors.cardBG
  },
  oprationTitle: {
    ...typography.numbersRegular15,
    color: colors.black
  },
  oprationSubtitle: {
    ...typography.numbersRegular11,
    color: colors.gray1
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: formatSize(12)
  },
  detailText: {
    color: colors.gray1
  },
  detailItemBorder: {
    borderBottomWidth: formatSize(0.5),
    borderBottomColor: colors.lines
  },
  row: {
    flexDirection: 'row'
  },
  justifyBetween: {
    justifyContent: 'space-between'
  },
  itemsStart: {
    alignItems: 'flex-start'
  },
  itemsEnd: {
    alignItems: 'flex-end'
  },
  itemsCenter: {
    alignItems: 'center'
  },
  robotBackground: {
    backgroundColor: colors.navigation
  },
  ntfPrice: {
    ...typography.numbersRegular11,
    color: colors.gray1
  },
  chevron: {
    padding: formatSize(4)
  }
}));
