import { useMemo } from 'react';

import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { useAssetExchangeRateGetter } from 'src/store/settings/settings-selectors';
import { useAssetMetadataSelector } from 'src/store/tokens-metadata/tokens-metadata-selectors';
import { TEZ_TOKEN_METADATA, TEZ_TOKEN_SLUG, TZBTC_TOKEN_METADATA } from 'src/token/data/tokens-metadata';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { fromTokenSlug } from 'src/utils/from-token-slug';

import { ActivityAssetImageKind, ActivityAssetView, ActivityRowAsset } from '../types';

const TZBTC_TOKEN_SLUG = getTokenSlug(TZBTC_TOKEN_METADATA);

const getCryptoLogoName = (assetSlug: string) => {
  if (assetSlug === TEZ_TOKEN_SLUG) {
    return CryptoLogoNameEnum.Tezos;
  }

  // tzBTC's seeded metadata carries only a bundled icon and no thumbnailUri
  if (assetSlug === TZBTC_TOKEN_SLUG) {
    return CryptoLogoNameEnum.TzBtc;
  }

  return undefined;
};

export const useTezosActivityAsset = (assetSlug?: string, amountSigned?: string | null): ActivityAssetView => {
  const storeMetadata = useAssetMetadataSelector(assetSlug ?? '');
  const metadata = assetSlug === TEZ_TOKEN_SLUG ? TEZ_TOKEN_METADATA : storeMetadata;
  const getExchangeRate = useAssetExchangeRateGetter();

  return useMemo(() => {
    if (assetSlug == null) {
      return {};
    }

    const [contract] = fromTokenSlug(assetSlug);
    const isNft = metadata?.artifactUri != null;
    const cryptoLogoName = getCryptoLogoName(assetSlug);

    const asset: ActivityRowAsset = {
      contract,
      amountSigned,
      decimals: metadata?.decimals,
      symbol: metadata?.symbol === '' ? undefined : metadata?.symbol,
      name: metadata?.name === '' ? undefined : metadata?.name,
      isNft,
      image:
        cryptoLogoName != null
          ? { kind: ActivityAssetImageKind.cryptoLogo, name: cryptoLogoName }
          : metadata == null
          ? undefined
          : { kind: ActivityAssetImageKind.tokenIcon, thumbnailUri: metadata.thumbnailUri }
    };

    return { asset, fiatRate: isNft ? undefined : getExchangeRate(assetSlug) };
  }, [assetSlug, amountSigned, metadata, getExchangeRate]);
};
