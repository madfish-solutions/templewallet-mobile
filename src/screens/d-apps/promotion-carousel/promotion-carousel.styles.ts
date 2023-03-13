import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const usePromotionCarouselStyles = createUseStyles(({ colors }) => ({
  container: {
    marginVertical: formatSize(12)
  },
  promotionItem: {
    backgroundColor: colors.pageBG
  }
}));
