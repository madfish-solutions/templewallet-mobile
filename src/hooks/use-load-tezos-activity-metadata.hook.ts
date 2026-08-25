import { useEffect, useRef } from 'react';

import { Activity } from 'src/activity/types';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { dispatch } from 'src/store';
import { loadTokensMetadataActions } from 'src/store/tokens-metadata/tokens-metadata-actions';
import { useAreMetadatasLoadingSelector } from 'src/store/tokens-metadata/tokens-metadata-selectors';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { isTruthy } from 'src/utils/is-truthy';
import { useTokenMetadataGetter } from 'src/utils/token-metadata.utils';

const LOAD_CHUNK_SIZE = 50;
// Bounded retries: the epic's switchMap lets a concurrent dispatcher (use-metadata-loading) cancel our batch, while slugs the API answers `null` for get parked after the last attempt
const MAX_LOAD_ATTEMPTS = 3;

/** Fetches metadata for Tezos assets seen in the feed but absent from the store (e.g. received NFTs) */
export const useLoadTezosActivityMetadata = (activities: Activity[], resetKey: string) => {
  const getMetadata = useTokenMetadataGetter();
  const metadataLoading = useAreMetadatasLoadingSelector();

  const loadAttemptsRef = useRef(new Map<string, number>());
  const resetKeyRef = useRef(resetKey);

  if (resetKeyRef.current !== resetKey) {
    resetKeyRef.current = resetKey;
    loadAttemptsRef.current.clear();
  }

  useEffect(() => {
    if (metadataLoading) {
      return;
    }

    const attempts = loadAttemptsRef.current;
    const missing = new Set<string>();

    for (const activity of activities) {
      if (activity.chain !== TempleChainKind.Tezos) {
        continue;
      }

      for (const operation of activity.operations) {
        const slug = operation.assetSlug;

        if (
          slug == null ||
          slug === TEZ_TOKEN_SLUG ||
          (attempts.get(slug) ?? 0) >= MAX_LOAD_ATTEMPTS ||
          isTruthy(getMetadata(slug))
        ) {
          continue;
        }

        missing.add(slug);
      }
    }

    const missingChunk = Array.from(missing).slice(0, LOAD_CHUNK_SIZE);

    if (missingChunk.length > 0) {
      missingChunk.forEach(slug => attempts.set(slug, (attempts.get(slug) ?? 0) + 1));

      dispatch(loadTokensMetadataActions.submit(missingChunk));
    }
  }, [activities, getMetadata, metadataLoading]);
};
