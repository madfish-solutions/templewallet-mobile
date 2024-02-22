import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useNewOptimalPromotionStyles = createUseStylesMemoized(() => ({
  bannerImage: {
    height: formatSize(112),
    width: formatSize(343),
    borderRadius: formatSize(10)
  }
}));
