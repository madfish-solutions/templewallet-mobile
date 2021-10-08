import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useSelectBakerModalStyles = createUseStyles(({ colors, typography }) => ({
  background: {
    backgroundColor: colors.navigation
  },
  upperContainer: {
    paddingHorizontal: formatSize(16),
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  searchContainer: {
    paddingHorizontal: formatSize(8)
  },
  infoText: {
    ...typography.caption11Regular,
    color: colors.black,
    paddingVertical: formatSize(16),
    paddingHorizontal: formatSize(4)
  },
  flatList: {
    backgroundColor: colors.navigation,
    paddingHorizontal: formatSize(16)
  },
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
    width: formatSize(50)
  },
  selectedBakerFieldWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  }
}));
