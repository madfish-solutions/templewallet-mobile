import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useMultichainTokenIconStyles = createUseStyles(() => ({
  container: {
    position: 'relative',
    margin: formatSize(2)
  },
  networkBadge: {
    position: 'absolute',
    right: formatSize(2),
    bottom: formatSize(2)
  }
}));
