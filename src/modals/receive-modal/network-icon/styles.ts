import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useNetworkIconStyles = createUseStylesMemoized(({ colors }) => ({
  root: {
    borderRadius: formatSize(18),
    borderColor: colors.gray4,
    borderWidth: formatSize(1),
    justifyContent: 'center',
    alignItems: 'center',
    width: formatSize(36),
    height: formatSize(36)
  }
}));
