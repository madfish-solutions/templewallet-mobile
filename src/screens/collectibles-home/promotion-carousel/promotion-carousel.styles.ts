import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const usePromotionCarouselStyles = createUseStyles(({ colors }) => ({
  paginationContainer: {
    paddingVertical: formatSize(2)
  },
  paginationDot: {
    width: formatSize(8),
    height: formatSize(8),
    borderRadius: formatSize(4),
    backgroundColor: colors.peach
  },
  paginationInactiveDot: {
    backgroundColor: colors.lines
  }
}));
