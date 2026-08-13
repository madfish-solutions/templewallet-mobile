import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useCollectibleImageStyles = createUseStylesMemoized(() => ({
  container: {
    borderRadius: formatSize(4)
  },
  image: {
    width: '100%',
    height: '100%'
  },
  brokenImage: {
    width: '100%',
    height: '100%'
  }
}));
