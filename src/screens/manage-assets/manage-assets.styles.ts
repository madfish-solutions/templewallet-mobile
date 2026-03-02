import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useManageAssetsStyles = createUseStyles(({ colors, typography }) => ({
  segmentControlContainer: {
    padding: formatSize(2),
    marginHorizontal: formatSize(16)
  },
  descriptionText: {
    ...typography.caption13Regular,
    color: colors.gray1,
    paddingVertical: formatSize(8),
    marginHorizontal: formatSize(16)
  },
  contentContainerStyle: {
    paddingRight: 0,
    paddingLeft: formatSize(16)
  }
}));
