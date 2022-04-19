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
    aspectRatio: 343 / 112,
    maxWidth: '100%'
  }
}));
