import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useNewHypelabPromotionStyles = createUseStylesMemoized(() => ({
  imageAdFrameWrapper: {
    width: formatSize(320),
    height: formatSize(50),
    borderRadius: formatSize(8),
    overflow: 'hidden'
  },
  imageAdFrame: {
    width: '100%',
    borderRadius: formatSize(8)
  },
  closeButton: {
    position: 'absolute',
    top: formatSize(6),
    right: formatSize(6),
    padding: formatSize(6)
  },
  textAdFrameContainer: {
    width: '100%',
    position: 'relative'
  },
  textAdFrame: {
    width: '100%',
    borderRadius: formatSize(10)
  },
  invisible: {
    opacity: 0
  }
}));
