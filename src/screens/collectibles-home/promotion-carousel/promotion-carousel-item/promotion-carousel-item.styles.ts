import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const usePromotionCarouselItemStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    paddingHorizontal: formatSize(8),
    paddingVertical: formatSize(4),
    borderRadius: formatSize(10)
  },
  emojisContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: formatSize(12)
  },
  text: {
    ...typography.numbersStatus8,
    color: colors.white,
    textTransform: 'uppercase',
    alignSelf: 'flex-end'
  }
}));
