import { EvmAssetsRecord } from 'src/store/evm/assets/evm-assets-state';

export const filterManualAssetMetadata = <T>(
  metadata: Record<string, T>,
  assets: EvmAssetsRecord,
  chainId: number
): Record<string, T> => {
  const manualSlugs = new Set<string>();
  for (const accountChains of Object.values(assets)) {
    for (const [slug, asset] of Object.entries(accountChains[chainId] ?? {})) {
      if (asset.manual) manualSlugs.add(slug);
    }
  }

  return Object.fromEntries(Object.entries(metadata).filter(([slug]) => !manualSlugs.has(slug)));
};
