import { formatSize } from 'src/styles/format-size';

export type TokenDropdownItemVariant = 'v1' | 'v2';

interface TokenDropdownItemIconConfig {
  gap: number;
  size: number;
  visualSize: number;
}

export interface TokenDropdownItemVariantConfig {
  isCompact: boolean;
  listIconConfig: TokenDropdownItemIconConfig;
  selectedIconConfig: TokenDropdownItemIconConfig;
  showNetworkBadge: boolean;
}

export const tokenDropdownItemVariantConfigs: Record<TokenDropdownItemVariant, TokenDropdownItemVariantConfig> = {
  v1: {
    isCompact: false,
    listIconConfig: {
      gap: formatSize(8),
      size: formatSize(40),
      visualSize: formatSize(40)
    },
    selectedIconConfig: {
      gap: formatSize(8),
      size: formatSize(32),
      visualSize: formatSize(32)
    },
    showNetworkBadge: false
  },
  v2: {
    isCompact: true,
    listIconConfig: {
      gap: formatSize(4),
      size: formatSize(44),
      visualSize: formatSize(40)
    },
    selectedIconConfig: {
      gap: formatSize(4),
      size: formatSize(40),
      visualSize: formatSize(40)
    },
    showNetworkBadge: true
  }
};
