import { black } from 'src/config/styles';
import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const useImagePromotionViewStyles = createUseStylesMemoized(({ colors }) => ({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: formatSize(112),
    position: 'relative'
  },
  invisible: {
    display: 'none'
  },
  bageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
    overflow: 'hidden',
    backgroundColor: colors.blue,
    borderTopLeftRadius: formatSize(10),
    borderBottomRightRadius: formatSize(10)
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
