import { createUseStyles } from '../../../../styles/create-use-styles';
import { formatSize } from '../../../../styles/format-size';

export const usePromotionCarouselItemStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  rewardContainer: {
    position: 'relative'
  },
  bannerImage: {
    height: formatSize(112),
    width: formatSize(343),
    borderRadius: formatSize(10)
  },
  textContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
    overflow: 'hidden',
    backgroundColor: colors.blue,
    borderTopLeftRadius: formatSize(10),
    borderBottomRightRadius: formatSize(10)
  },
  text: {
    ...typography.caption13Semibold,
    color: 'white',
    lineHeight: formatSize(18),
    letterSpacing: formatSize(-0.08),
    paddingHorizontal: formatSize(12)
  }
}));
