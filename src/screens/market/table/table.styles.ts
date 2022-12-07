import { formatSize } from '../../../styles/format-size';
import { createUseStyles } from './../../../styles/create-use-styles';

export const useTableStyles = createUseStyles(({ colors, typography }) => ({
  columns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: formatSize(14),
    paddingVertical: formatSize(10),
    borderTopWidth: formatSize(1),
    borderBottomWidth: formatSize(1),
    borderColor: colors.lines
  },
  text: {
    ...typography.numbersRegular11,
    color: colors.gray2
  },
  name: {
    marginRight: formatSize(88),
    marginLeft: formatSize(16)
  },
  price: {
    marginRight: formatSize(52),
    fontSize: formatSize(11)
  },
  h24: {
    marginRight: 'auto'
  }
}));
