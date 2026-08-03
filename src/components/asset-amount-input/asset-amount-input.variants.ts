import { formatSize } from 'src/styles/format-size';

export type AssetAmountInputVariant = 'v1' | 'v2';

export interface AssetAmountInputVariantConfig {
  inputHeight?: number;
  dropdownVerticalPadding?: number;
  selectedTokenDropdownWidth?: number;
}

export const assetAmountInputVariantConfigs: Record<AssetAmountInputVariant, AssetAmountInputVariantConfig> = {
  v1: {},
  v2: {
    inputHeight: formatSize(56),
    dropdownVerticalPadding: formatSize(8),
    selectedTokenDropdownWidth: formatSize(122)
  }
};
