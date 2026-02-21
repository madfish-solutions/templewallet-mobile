import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useSorterStyles = createUseStyles(({ colors, typography }) => ({
  sortSelector: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  sortByLabel: {
    ...typography.caption11Regular,
    color: colors.gray2,
    marginRight: formatSize(2)
  },
  selectedBakerSortField: {
    ...typography.caption11Regular,
    color: colors.black,
    marginLeft: formatSize(2)
  },
  selectedBakerFieldWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  }
}));
