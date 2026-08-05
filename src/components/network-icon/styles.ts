import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useNetworkLogoStyles = createUseStylesMemoized(({ colors }) => ({
  compact: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.lines,
    borderRadius: formatSize(8),
    borderWidth: formatSize(1),
    height: formatSize(16),
    justifyContent: 'center',
    width: formatSize(16)
  },
  compactTransparent: {
    alignItems: 'center',
    borderColor: colors.lines,
    borderRadius: formatSize(8),
    borderWidth: formatSize(1),
    height: formatSize(16),
    justifyContent: 'center',
    width: formatSize(16)
  },
  tokenBadge: {
    alignItems: 'center',
    backgroundColor: colors.pageBG,
    borderColor: colors.lines,
    borderRadius: formatSize(8),
    borderWidth: formatSize(1),
    height: formatSize(16),
    justifyContent: 'center',
    width: formatSize(16)
  },
  large: {
    alignItems: 'center',
    borderColor: colors.gray4,
    borderRadius: formatSize(18),
    borderWidth: formatSize(1),
    height: formatSize(36),
    justifyContent: 'center',
    width: formatSize(36)
  }
}));
