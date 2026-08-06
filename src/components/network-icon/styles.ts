import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useNetworkLogoStyles = createUseStylesMemoized(({ colors }) => ({
  common: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: formatSize(1)
  },
  compact: {
    backgroundColor: colors.white,
    borderRadius: formatSize(8),
    height: formatSize(16),
    width: formatSize(16)
  },
  compactTransparent: {
    borderColor: colors.lines,
    borderRadius: formatSize(8),
    height: formatSize(16),
    width: formatSize(16)
  },
  tokenBadge: {
    backgroundColor: colors.pageBG,
    borderColor: colors.lines,
    borderRadius: formatSize(8),
    height: formatSize(16),
    width: formatSize(16)
  },
  nftBadge: {
    backgroundColor: colors.cardBG,
    borderColor: colors.gray4,
    borderRadius: formatSize(12),
    height: formatSize(24),
    width: formatSize(24)
  },
  large: {
    borderColor: colors.gray4,
    borderRadius: formatSize(18),
    height: formatSize(36),
    width: formatSize(36)
  }
}));
