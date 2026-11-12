import { tokenEqualityFn } from 'src/components/token-dropdown/token-equality-fn';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata.ts';
import { TezosTokenMetadata } from 'src/token/interfaces/token-metadata.interface';
import { SendAsset, isTezosSendAsset } from 'src/types/send-asset';

export { useAssetSelection as useSendAssetSelection } from 'src/hooks/use-asset-selection';

export const getInitialSendAsset = (
  assets: SendAsset[],
  initialAssetKey?: string,
  initialToken?: TezosTokenMetadata
): SendAsset =>
  assets.find(item => item.assetKey === initialAssetKey) ??
  assets.find(item => isTezosSendAsset(item) && tokenEqualityFn(item, initialToken)) ??
  assets.find(item => item.assetSlug === TEZ_TOKEN_SLUG) ??
  assets[0];
