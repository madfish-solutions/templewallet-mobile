import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useDexIconStyles = createUseStyles(() => ({
  image: {
    height: formatSize(20),
    width: formatSize(20),
    borderRadius: formatSize(10)
  }
}));
