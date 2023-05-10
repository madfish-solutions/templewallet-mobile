import { black } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const usePromotionItemStyles = createUseStyles(({ colors }) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cardBG
  },
  loaderContainer: {
    backgroundColor: colors.cardBG,
    justifyContent: 'center',
    alignItems: 'center',
    height: formatSize(112),
    width: formatSize(343),
    borderRadius: formatSize(10),
    ...generateShadow(1, black)
  },
  rewardContainer: {
    position: 'relative'
  },
  bannerImage: {
    height: formatSize(112),
    width: formatSize(343),
    borderRadius: formatSize(10)
  },
  bageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2
  },
  closeButton: {
    position: 'absolute',
    top: formatSize(8),
    right: formatSize(10),
    width: formatSize(24),
    height: formatSize(24),
    borderRadius: formatSize(12),
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    ...generateShadow(1, black)
  }
}));
