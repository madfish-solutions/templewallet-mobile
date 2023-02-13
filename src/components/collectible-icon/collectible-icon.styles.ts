import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useCollectibleIconStyles = createUseStyles(({ colors }) => ({
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.blue10,
    borderRadius: formatSize(8)
  }
}));
