import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useCollectibleImageStyles = createUseStylesMemoized(() => ({
  container: {
    overflow: 'hidden',
    borderRadius: formatSize(4)
  },
  image: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  zeroOpacity: {
    opacity: 0
  },
  containedImage: {
    borderRadius: formatSize(4)
  },
  brokenImage: {
    width: '100%',
    height: '100%'
  }
}));
