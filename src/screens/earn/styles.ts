import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useEarnPageStyles = createUseStylesMemoized(() => ({
  loader: {
    marginTop: formatSize(100)
  }
}));
