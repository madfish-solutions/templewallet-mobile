import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useHeaderCloseButtonStyles = createUseStylesMemoized(({ colors }) => ({
  icon: {
    backgroundColor: colors.peach10,
    borderRadius: formatSize(100)
  }
}));
