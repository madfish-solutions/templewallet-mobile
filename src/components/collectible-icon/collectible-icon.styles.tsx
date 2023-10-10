import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useCollectibleIconStyles = createUseStyles(() => ({
  container: {
    borderRadius: formatSize(4),
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    borderRadius: formatSize(4),
    justifyContent: 'center',
    alignItems: 'center'
  }
}));
