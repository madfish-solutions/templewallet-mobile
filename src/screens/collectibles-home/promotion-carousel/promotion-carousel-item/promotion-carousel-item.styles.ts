import { black, dark } from '../../../../config/styles';
import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const usePromotionCarouselItemStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: formatSize(35),
    paddingVertical: formatSize(32),
    backgroundColor: colors.blue10,
    borderRadius: 10
  },
  textContainer: {
    flexDirection: 'column',
    maxWidth: formatSize(185)
  },
  title: {
    ...typography.body17Semibold,
    color: dark
  },
  description: {
    ...typography.caption11Regular,
    color: black
  }
}));
