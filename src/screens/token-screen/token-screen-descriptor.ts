import type { ActivityFeedAssetFilter } from 'src/activity/feed';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import type { MultichainDisplayedToken } from 'src/hooks/evm/use-multichain-displayed-tokens.hook';
import { toChainAssetSlug } from 'src/utils/chain-asset-slug';

export interface TokenScreenDescriptor {
  chainKind: TempleChainKind;
  chainId: string | number;
  slug: string;
}

export const findDisplayedToken = (tokens: MultichainDisplayedToken[], descriptor: TokenScreenDescriptor) => {
  const descriptorKey = toChainAssetSlug(descriptor.chainKind, descriptor.chainId, descriptor.slug);

  return tokens.find(token => toChainAssetSlug(token.chainKind, token.chainId, token.slug) === descriptorKey);
};

export const toActivityAssetFilter = (descriptor: TokenScreenDescriptor): ActivityFeedAssetFilter =>
  descriptor.chainKind === TempleChainKind.Tezos
    ? { chainKind: TempleChainKind.Tezos, assetSlug: descriptor.slug }
    : { chainKind: TempleChainKind.EVM, contract: descriptor.slug };
