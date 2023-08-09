import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const usePromotionCarouselStyles = createUseStyles(({ colors }) => ({
  root: {
    marginTop: formatSize(12),
    marginBottom: formatSize(4)
  },
  promotionItem: {
    backgroundColor: colors.pageBG,
    width: '100%'
  }
}));
