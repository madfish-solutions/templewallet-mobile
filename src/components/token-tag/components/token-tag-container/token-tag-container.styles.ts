import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useTokenTagContainerStyles = createUseStyles(({ colors }) => ({
  apyContainer: {
    backgroundColor: colors.blue,
    borderRadius: formatSize(8),
    paddingHorizontal: formatSize(6),
    paddingVertical: formatSize(2),
    marginLeft: formatSize(4)
  },
  scam: {
    backgroundColor: colors.destructive
  }
}));
