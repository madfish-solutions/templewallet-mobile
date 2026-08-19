import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { AssetInterface } from 'src/interfaces/asset.interface';
import { TEZ_SHIELDED_TOKEN_SLUG, TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { isCollectible } from 'src/utils/tezos.util';

const isLegacyToken = (asset: AssetInterface): asset is TokenInterface =>
  'address' in asset && typeof asset.address === 'string' && 'id' in asset && typeof asset.id === 'number';

export const getAssetSlug = (asset: AssetInterface): string =>
  asset.assetSlug ?? (isLegacyToken(asset) ? getTokenSlug(asset) : TEZ_TOKEN_SLUG);

export const getAssetKey = (asset: AssetInterface): string => asset.assetKey ?? getAssetSlug(asset);

export const getAssetStoreKey = (asset: AssetInterface): string =>
  asset.chainKind === TempleChainKind.EVM ? getAssetKey(asset) : getAssetSlug(asset);

export const assetsEqualityFn = (asset: AssetInterface, other?: AssetInterface): boolean => {
  if (!other) {
    return false;
  }

  if (asset.assetKey || other.assetKey) {
    return asset.assetKey === other.assetKey;
  }

  if (!isLegacyToken(asset) || !isLegacyToken(other)) {
    return false;
  }

  if (!asset.address && !other.address) {
    return asset.symbol === other.symbol;
  }

  return asset.address === other.address && asset.id === other.id;
};

export const isShieldedAsset = (asset: AssetInterface): boolean => getAssetSlug(asset) === TEZ_SHIELDED_TOKEN_SLUG;

export const isCollectibleAsset = (asset: AssetInterface): boolean => {
  if (asset.chainKind === TempleChainKind.EVM && 'sendStandard' in asset) {
    return asset.sendStandard === EvmAssetStandardEnum.ERC721 || asset.sendStandard === EvmAssetStandardEnum.ERC1155;
  }

  return isLegacyToken(asset) && isCollectible(asset);
};
