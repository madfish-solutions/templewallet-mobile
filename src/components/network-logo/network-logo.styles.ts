import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useNetworkLogoStyles = createUseStylesMemoized(({ colors }) => ({
  root: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.lines,
    borderRadius: formatSize(8),
    borderWidth: formatSize(0.8),
    height: formatSize(16),
    justifyContent: 'center',
    width: formatSize(16)
  }
}));
