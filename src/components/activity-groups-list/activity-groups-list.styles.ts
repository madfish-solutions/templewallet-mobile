import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useActivityGroupsListStyles = createUseStyles(({ colors, typography }) => ({
  sectionListContentContainer: {
    paddingTop: formatSize(8),
    paddingBottom: formatSize(16),
    paddingHorizontal: formatSize(16)
  },
  sectionHeaderText: {
    ...typography.numbersMedium13,
    color: colors.gray2,
    backgroundColor: colors.pageBG,
    paddingVertical: formatSize(4)
  }
}));
