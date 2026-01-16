import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useTopTokensTableStyles = createUseStyles(({ colors, typography }) => ({
  rootContainer: {
    flexGrow: 1,
    flexShrink: 1
  },
  columns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: formatSize(14),
    paddingVertical: formatSize(10),
    borderTopWidth: formatSize(1),
    borderBottomWidth: formatSize(1),
    borderColor: colors.lines
  },
  listContainer: {
    position: 'relative',
    flexGrow: 1,
    flexShrink: 1
  },
  text: {
    ...typography.numbersRegular11,
    color: colors.gray2,
    flexBasis: '25%',
    textAlign: 'right'
  },
  name: {
    textAlign: 'center'
  },
  promotionWrapper: {
    backgroundColor: colors.pageBG,
    paddingVertical: formatSize(12),
    paddingHorizontal: formatSize(16),
    borderBottomWidth: formatSize(1),
    borderColor: colors.lines
  }
}));
