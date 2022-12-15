import { formatSize } from '../../../styles/format-size';
import { createUseStyles } from './../../../styles/create-use-styles';

export const useTableStyles = createUseStyles(({ colors, typography }) => ({
  rootContainer: {
    flexGrow: 1,
    flexShrink: 1
  },
  columns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: formatSize(14),
    paddingVertical: formatSize(10),
    paddingLeft: formatSize(30),
    borderTopWidth: formatSize(1),
    borderBottomWidth: formatSize(1),
    borderColor: colors.lines
  },
  text: {
    ...typography.numbersRegular11,
    color: colors.gray2
  },
  price: {
    paddingLeft: formatSize(42)
  }
}));
