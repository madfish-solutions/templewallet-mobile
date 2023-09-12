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
  robotBackground: {
    backgroundColor: colors.navigation
  },
  red: {
    backgroundColor: 'red'
  },
  green: {
    backgroundColor: 'green'
  },
  chevron: {
    padding: formatSize(4)
  },
  card: {
    marginTop: formatSize(12),
    paddingHorizontal: formatSize(12),
    borderRadius: formatSize(8),
    backgroundColor: colors.cardBG
  }
}));

export const useActivityDetailsStyles = createUseStyles(({ colors, typography }) => ({
  itemWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: formatSize(12)
  },
  text: {
    color: colors.gray1
  },
  border: {
    borderBottomWidth: formatSize(0.5),
    borderBottomColor: colors.lines
  },
  hashChip: {
    height: formatSize(24)
  },
  mb8: {
    marginBottom: formatSize(8)
  },
  symbolText: {
    ...typography.numbersRegular13,
    color: colors.black
  }
}));

export const useActivityCommonStyles = createUseStyles(() => ({
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
  }
}));
