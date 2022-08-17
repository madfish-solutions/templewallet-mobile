import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const usePromotionCarouselItemStyles = createUseStyles(() => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bannerImage: {
    height: formatSize(112),
    width: formatSize(343),
    borderRadius: formatSize(10)
  }
}));
