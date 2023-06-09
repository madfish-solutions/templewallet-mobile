import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useCollectibleIconStyles = createUseStyles(({ colors }) => ({
  container: {
    borderRadius: formatSize(4),
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: formatSize(4),
    backgroundColor: colors.blue10
  }
}));
