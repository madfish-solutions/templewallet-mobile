import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const usePasswordStrengthIndicatorStyles = createUseStylesMemoized(() => ({
  root: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: formatSize(4)
  }
}));
