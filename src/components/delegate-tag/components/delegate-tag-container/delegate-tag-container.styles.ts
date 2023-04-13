import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const useDelegateTagContainerStyles = createUseStyles(({ colors }) => ({
  apyContainer: {
    backgroundColor: colors.blue,
    borderRadius: formatSize(8),
    paddingHorizontal: formatSize(6),
    paddingVertical: formatSize(2),
    marginLeft: formatSize(4)
  }
}));
