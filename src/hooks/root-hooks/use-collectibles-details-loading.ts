import { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { COLLECTIBLES_DETAILS_SYNC_INTERVAL } from 'src/config/fixed-times';
import { loadCollectiblesDetailsActions } from 'src/store/collectibles/collectibles-actions';
import {
  useAllCollectiblesDetailsSelector,
  useCollectiblesDetailsInFlightSelector,
  useCollectiblesDetailsLoadingSelector
} from 'src/store/collectibles/collectibles-selectors';
import { CollectibleDetailsRecord } from 'src/store/collectibles/collectibles-state';
import { useTokensMetadataSelector } from 'src/store/tokens-metadata/tokens-metadata-selectors';
import { useAllCurrentAccountAssetsSelector, useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
import { WR_TOKEN_METADATA } from 'src/token/data/tokens-metadata';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { isCollectible } from 'src/utils/tezos.util';

import { useAuthorisedInterval } from '../use-authed-interval';
import { useUpdatableRef } from '../use-updatable-ref.hook';

type CollectiblesSubgroupName = 'noDetails' | 'withDetails';
type CollectiblesSlugsGroups = Record<'visible' | 'other', Record<CollectiblesSubgroupName, Set<string>>>;
const COLLECTIBLES_LOAD_SUBGROUP_NAMES = ['noDetails', 'withDetails'] as const;
const COLLECTIBLES_LOAD_GROUP_NAMES = ['visible', 'other'] as const;

const createEmptyCollectiblesSlugsGroups = (): CollectiblesSlugsGroups => ({
  visible: { noDetails: new Set(), withDetails: new Set() },
  other: { noDetails: new Set(), withDetails: new Set() }
});

const WR_TOKEN_SLUG = toTokenSlug(WR_TOKEN_METADATA.address, WR_TOKEN_METADATA.id);

export const useCollectiblesDetailsLoading = () => {
  const accountPkh = useCurrentAccountPkhSelector();
  const assets = useAllCurrentAccountAssetsSelector();
  const allMetadatas = useTokensMetadataSelector();
  const collectiblesDetails = useAllCollectiblesDetailsSelector();
  const collectiblesDetailsAreLoading = useCollectiblesDetailsLoadingSelector();
  const collectiblesDetailsInFlight = useCollectiblesDetailsInFlightSelector();

  const prevAccountPkhRef = useRef(accountPkh);
  const prevCollectiblesVisibilityRef = useRef<Partial<StringRecord<boolean>>>({});
  const prevCollectiblesDetailsRef = useRef<CollectibleDetailsRecord>({});
  const collectiblesSlugsGroupsToUpdateRef = useRef(createEmptyCollectiblesSlugsGroups());
  const lastReviewTsRef = useRef(0);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const collectiblesDetailsInFlightRef = useUpdatableRef(collectiblesDetailsInFlight);

  const dispatch = useDispatch();

  const updateCollectiblesByGroups = useCallback(() => {
    const groups = collectiblesSlugsGroupsToUpdateRef.current;
    const slugs: string[] = [];

    COLLECTIBLES_LOAD_SUBGROUP_NAMES.forEach(subgroupName => {
      COLLECTIBLES_LOAD_GROUP_NAMES.forEach(groupName => {
        for (const slug of groups[groupName][subgroupName]) {
          slugs.push(slug);
        }
      });
    });

    collectiblesSlugsGroupsToUpdateRef.current = createEmptyCollectiblesSlugsGroups();

    if (slugs.length > 0) {
      dispatch(loadCollectiblesDetailsActions.submit(slugs));
    }
  }, [dispatch]);

  useAuthorisedInterval(() => updateCollectiblesByGroups(), 15000, [updateCollectiblesByGroups]);

  useAuthorisedInterval(
    () => {
      /* TODO:
        1. Is it necessary for collectibles on non-Mainnet networks too?
        2. Handle failing collectibles details requests better */
      const now = Date.now();
      if (prevAccountPkhRef.current !== accountPkh) {
        prevAccountPkhRef.current = accountPkh;
        prevCollectiblesVisibilityRef.current = {};
        prevCollectiblesDetailsRef.current = {};
        collectiblesSlugsGroupsToUpdateRef.current = createEmptyCollectiblesSlugsGroups();
      }

      const { removed: removedSlugs, stored: storedAssets } = assets ?? { removed: [], stored: [] };
      let slugsHaveBeenAdded = false;

      removedSlugs.forEach(slug => (prevCollectiblesVisibilityRef.current[slug] = undefined));

      storedAssets.forEach(({ slug, visibility }) => {
        const metadata = allMetadatas[slug];

        if (removedSlugs.includes(slug) || !metadata || !isCollectible(metadata) || slug === WR_TOKEN_SLUG) {
          return;
        }

        const isVisible = visibility === 'visible';
        const collectibleDetails = collectiblesDetails[slug];
        const hadDetails = prevCollectiblesDetailsRef.current[slug] !== undefined;
        const hasDetails = collectibleDetails !== undefined;
        const nextGroupName = isVisible ? 'visible' : 'other';
        const nextSubgroupName = hasDetails ? 'withDetails' : 'noDetails';
        const wasVisible = prevCollectiblesVisibilityRef.current[slug];
        prevCollectiblesVisibilityRef.current[slug] = isVisible;

        if (wasVisible === undefined) {
          collectiblesSlugsGroupsToUpdateRef.current[nextGroupName][nextSubgroupName].add(slug);
          slugsHaveBeenAdded = true;

          return;
        }

        const prevGroupName = wasVisible ? 'visible' : 'other';
        const prevSubgroupName = hadDetails ? 'withDetails' : 'noDetails';
        const isGoingToBeUpdated =
          collectiblesSlugsGroupsToUpdateRef.current[prevGroupName][prevSubgroupName].has(slug);

        if (collectiblesDetailsInFlightRef.current[slug]) {
          return;
        }

        if (isGoingToBeUpdated && (prevGroupName !== nextGroupName || prevSubgroupName !== nextSubgroupName)) {
          collectiblesSlugsGroupsToUpdateRef.current[prevGroupName][prevSubgroupName].delete(slug);
          collectiblesSlugsGroupsToUpdateRef.current[nextGroupName][nextSubgroupName].add(slug);

          return;
        }

        if (hasDetails && now - lastReviewTsRef.current < COLLECTIBLES_DETAILS_SYNC_INTERVAL / 2) {
          return;
        }

        if (!isGoingToBeUpdated) {
          collectiblesSlugsGroupsToUpdateRef.current[nextGroupName][nextSubgroupName].add(slug);
          slugsHaveBeenAdded = true;
        }
      });

      lastReviewTsRef.current = now;
      prevCollectiblesDetailsRef.current = collectiblesDetails;

      if (!slugsHaveBeenAdded) {
        return;
      }

      if (updateTimeoutRef.current !== null) {
        clearTimeout(updateTimeoutRef.current);
      }

      updateTimeoutRef.current = setTimeout(updateCollectiblesByGroups, 5000);
    },
    COLLECTIBLES_DETAILS_SYNC_INTERVAL,
    [assets, allMetadatas, collectiblesDetails, collectiblesDetailsAreLoading, accountPkh, updateCollectiblesByGroups]
  );
};
