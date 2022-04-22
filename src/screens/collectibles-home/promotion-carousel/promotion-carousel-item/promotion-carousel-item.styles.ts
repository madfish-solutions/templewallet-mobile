import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const usePromotionCarouselItemStyles = createUseStyles(() => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: formatSize(10)
  },
  bannerImage: {
    maxHeight: formatSize(112),
    maxWidth: formatSize(343),
    aspectRatio: 343 / 112
  }
}));
