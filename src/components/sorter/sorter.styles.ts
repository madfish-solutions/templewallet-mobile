import { formatSize } from '../../styles/format-size';

import { createUseStyles } from './../../styles/create-use-styles';

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
