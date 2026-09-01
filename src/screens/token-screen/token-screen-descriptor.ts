import type { ActivityFeedAssetFilter } from 'src/activity/feed';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import type { MultichainDisplayedToken } from 'src/hooks/evm/use-multichain-displayed-tokens.hook';
import type { ChainRef } from 'src/types/networks';
import { toChainAssetSlug } from 'src/utils/chain-asset-slug';

export type TokenScreenDescriptor = ChainRef & { slug: string };

export const toTokenScreenDescriptor = (token: MultichainDisplayedToken): TokenScreenDescriptor =>
  token.chainKind === TempleChainKind.Tezos
    ? { chainKind: TempleChainKind.Tezos, chainId: token.chainId, slug: token.slug }
    : { chainKind: TempleChainKind.EVM, chainId: token.chainId, slug: token.slug };

export const findDisplayedToken = (tokens: MultichainDisplayedToken[], descriptor: TokenScreenDescriptor) => {
  const descriptorKey = toChainAssetSlug(descriptor, descriptor.slug);

  return tokens.find(token => toChainAssetSlug(token, token.slug) === descriptorKey);
};

export const toActivityAssetFilter = (descriptor: TokenScreenDescriptor): ActivityFeedAssetFilter =>
  descriptor.chainKind === TempleChainKind.Tezos
    ? { chainKind: TempleChainKind.Tezos, assetSlug: descriptor.slug }
    : { chainKind: TempleChainKind.EVM, contract: descriptor.slug };
