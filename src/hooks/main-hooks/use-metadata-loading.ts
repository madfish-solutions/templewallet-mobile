import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { loadTokensMetadataActions } from 'src/store/tokens-metadata/tokens-metadata-actions';
import {
  useAreMetadatasLoadingSelector,
  useTokensMetadataSelector
} from 'src/store/tokens-metadata/tokens-metadata-selectors';
import { useAllCurrentAccountAssetsSelector, useIsAuthorisedSelector } from 'src/store/wallet/wallet-selectors';

import { useNetworkInfo } from '../use-network-info.hook';

export const useMetadataLoading = () => {
  const dispatch = useDispatch();

  const isAuthorised = useIsAuthorisedSelector();
  const { isTezosMainnet } = useNetworkInfo();

  const assets = useAllCurrentAccountAssetsSelector();
  const metadataRecord = useTokensMetadataSelector();
  const metadataLoading = useAreMetadatasLoadingSelector();

  const checkedSlugsRef = useRef(new Set<string>());

  useEffect(() => {
    if (!isAuthorised) {
      checkedSlugsRef.current = new Set();

      return;
    }

    const storedAssets = assets?.stored;

    if (metadataLoading || !storedAssets?.length || !isTezosMainnet) {
      return;
    }

    const missingSlugs: string[] = [];

    for (const { slug } of storedAssets) {
      // GAS (tez) is not in `stored`; do not add it here.
      if (metadataRecord[slug] || checkedSlugsRef.current.has(slug)) {
        continue;
      }

      missingSlugs.push(slug);
      checkedSlugsRef.current.add(slug);
    }

    if (missingSlugs.length > 0) {
      dispatch(loadTokensMetadataActions.submit(missingSlugs));
    }
  }, [assets, metadataRecord, metadataLoading, isAuthorised, isTezosMainnet, dispatch]);
};
