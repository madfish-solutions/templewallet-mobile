import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useLoaderStyles = createUseStyles(() => ({
  container: {
    position: 'relative'
  },
  icon: {
    position: 'absolute',
    top: formatSize(0),
    left: formatSize(0)
  }
}));
