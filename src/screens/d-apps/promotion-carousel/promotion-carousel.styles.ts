import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const usePromotionCarouselStyles = createUseStyles(({ colors }) => ({
  container: {
    marginVertical: formatSize(12)
  },
  promotionItemWrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  promotionItem: {
    backgroundColor: colors.pageBG,
    width: formatSize(343),
    shadowOpacity: 0,
    elevation: 0
  }
}));
