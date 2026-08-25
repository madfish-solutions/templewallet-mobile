import type { ActivityFeedAssetFilter } from 'src/activity/feed';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import type { MultichainDisplayedToken } from 'src/hooks/evm/use-multichain-displayed-tokens.hook';

export interface TokenScreenDescriptor {
  chainKind: TempleChainKind;
  chainId: string | number;
  slug: string;
}

export const findDisplayedToken = (tokens: MultichainDisplayedToken[], descriptor: TokenScreenDescriptor) =>
  tokens.find(
    token =>
      token.chainKind === descriptor.chainKind &&
      String(token.chainId) === String(descriptor.chainId) &&
      token.slug === descriptor.slug
  );

export const toActivityAssetFilter = (descriptor: TokenScreenDescriptor): ActivityFeedAssetFilter =>
  descriptor.chainKind === TempleChainKind.Tezos
    ? { chainKind: TempleChainKind.Tezos, assetSlug: descriptor.slug }
    : { chainKind: TempleChainKind.EVM, contract: descriptor.slug };
