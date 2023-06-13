import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useCollectionStyles = createUseStyles(() => ({
  root: {
    flex: 1,
    marginVertical: formatSize(12)
  },
  emptyBlock: {
    width: formatSize(20)
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  }
}));
