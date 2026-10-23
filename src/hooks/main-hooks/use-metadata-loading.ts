import { useEffect, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { store } from 'src/store';
import { loadTokensMetadataActions } from 'src/store/tokens-metadata/tokens-metadata-actions';
import { useAreMetadatasLoadingSelector } from 'src/store/tokens-metadata/tokens-metadata-selectors';
import { useAllCurrentAccountAssetsSelector, useIsAuthorisedSelector } from 'src/store/wallet/wallet-selectors';
import { useDidUpdate } from 'src/utils/hooks';
import { isTruthy } from 'src/utils/is-truthy';
import { useTokenMetadataGetter } from 'src/utils/token-metadata.utils';

import { useNetworkInfo } from '../use-network-info.hook';

const LOAD_CHUNK_SIZE = 50;
// The metadata API answers `null` for tokens it has not cached yet and fetches them in the background,
// so a token is requested again a few times before it counts as having no metadata
const MAX_LOAD_ATTEMPTS = 5;

export const useMetadataLoading = () => {
  const dispatch = useDispatch();

  const isAuthorised = useIsAuthorisedSelector();
  const { isTezosMainnet } = useNetworkInfo();

  const assets = useAllCurrentAccountAssetsSelector();
  const getMetadata = useTokenMetadataGetter();
  const metadataLoading = useAreMetadatasLoadingSelector();

  const slugsToCheck = useMemo(() => assets?.stored.map(t => t.slug), [assets]);

  const loadAttemptsRef = useRef(new Map<string, number>());

  useDidUpdate(() => void loadAttemptsRef.current.clear(), [isAuthorised]);

  useEffect(() => {
    if (metadataLoading || !slugsToCheck?.length || !isTezosMainnet || !isAuthorised) {
      return;
    }

    const attempts = loadAttemptsRef.current;
    const missingChunk: string[] = [];

    for (const slug of slugsToCheck) {
      if (
        // When modifying, make sure `slug` to not be of GAS
        !isTruthy(getMetadata(slug)) &&
        (attempts.get(slug) ?? 0) < MAX_LOAD_ATTEMPTS
      ) {
        missingChunk.push(slug);

        if (missingChunk.length >= LOAD_CHUNK_SIZE) {
          break;
        }
      }
    }

    if (missingChunk.length > 0 && !store.getState().tokensMetadata.isLoading) {
      missingChunk.forEach(slug => attempts.set(slug, (attempts.get(slug) ?? 0) + 1));

      dispatch(loadTokensMetadataActions.submit(missingChunk));
    }
  }, [slugsToCheck, getMetadata, metadataLoading, isAuthorised, isTezosMainnet, dispatch]);
};
