import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';

export const toChainAssetSlug = (chainKind: TempleChainKind, chainId: string | number, assetSlug: string) =>
  `${chainKind}:${chainId}:${assetSlug}`;
