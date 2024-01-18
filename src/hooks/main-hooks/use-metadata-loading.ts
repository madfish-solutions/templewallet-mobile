import { useEffect, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { loadTokensMetadataActions } from 'src/store/tokens-metadata/tokens-metadata-actions';
import { useAreMetadatasLoadingSelector } from 'src/store/tokens-metadata/tokens-metadata-selectors';
import { useAllCurrentAccountAssetsSelector, useIsAuthorisedSelector } from 'src/store/wallet/wallet-selectors';
import { useDidUpdate } from 'src/utils/hooks';
import { isTruthy } from 'src/utils/is-truthy';
import { useTokenMetadataGetter } from 'src/utils/token-metadata.utils';

import { useNetworkInfo } from '../use-network-info.hook';

const LOAD_CHUNK_SIZE = 50;

export const useMetadataLoading = () => {
  const dispatch = useDispatch();

  const isAuthorised = useIsAuthorisedSelector();
  const { isTezosMainnet } = useNetworkInfo();

  const assets = useAllCurrentAccountAssetsSelector();
  const getMetadata = useTokenMetadataGetter();
  const metadataLoading = useAreMetadatasLoadingSelector();

  const slugsToCheck = useMemo(() => assets?.stored.map(t => t.slug), [assets]);

  const checkedRef = useRef<string[]>([]);

  useDidUpdate(() => void (checkedRef.current = []), [isAuthorised]);

  useEffect(() => {
    if (metadataLoading || !slugsToCheck?.length || !isTezosMainnet || !isAuthorised) {
      return;
    }

    const missingChunk: string[] = [];

    for (const slug of slugsToCheck) {
      if (
        // When modifying, make sure `slug` to not be of GAS
        !isTruthy(getMetadata(slug)) &&
        // In case fetched metadata is `null` & won't save
        !checkedRef.current.includes(slug)
      ) {
        missingChunk.push(slug);

        if (missingChunk.length >= LOAD_CHUNK_SIZE) {
          break;
        }
      }
    }

    if (missingChunk.length > 0) {
      checkedRef.current = [...checkedRef.current, ...missingChunk];

      dispatch(loadTokensMetadataActions.submit(missingChunk));
    }
  }, [slugsToCheck, getMetadata, metadataLoading, isAuthorised, isTezosMainnet, dispatch]);
};
