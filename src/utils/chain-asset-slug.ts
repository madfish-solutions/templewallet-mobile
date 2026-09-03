import type { ChainRef } from 'src/types/networks';

export const toChainAssetSlug = ({ chainKind, chainId }: ChainRef, assetSlug: string) =>
  `${chainKind}:${chainId}:${assetSlug}`;
