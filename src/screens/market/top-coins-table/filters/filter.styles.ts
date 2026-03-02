import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useFilterStyles = createUseStyles(() => ({
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: formatSize(16),
    paddingVertical: formatSize(12)
  }
}));
