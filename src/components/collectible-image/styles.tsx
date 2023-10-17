import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useCollectibleImageStyles = createUseStyles(() => ({
  image: {
    borderRadius: formatSize(4)
  },
  brokenImage: {
    width: '100%',
    height: '100%'
  }
}));
