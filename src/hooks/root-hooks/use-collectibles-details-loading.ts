import { difference, isEqual } from 'lodash-es';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';

import { COLLECTIBLES_DETAILS_SYNC_INTERVAL } from 'src/config/fixed-times';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { loadCollectiblesDetailsActions } from 'src/store/collectibles/collectibles-actions';
import { useCollectiblesDetailsLoadingSelector } from 'src/store/collectibles/collectibles-selectors';
import { useCurrentAccountPkhSelector, useCurrentAccountStoredAssetsSelector } from 'src/store/wallet/wallet-selectors';

import { useAuthorisedInterval } from '../use-authed-interval';
import { useMemoWithCompare } from '../use-memo-with-compare';

export const useCollectiblesDetailsLoading = () => {
  const accountPkh = useCurrentAccountPkhSelector();
  const collectibles = useCurrentAccountStoredAssetsSelector('collectibles');

  const visibleCollectiblesSlugs = useMemoWithCompare(
    () =>
      collectibles
        .filter(({ visibility }) => visibility === VisibilityEnum.Visible)
        .map(({ slug }) => slug)
        .sort(),
    [collectibles],
    isEqual
  );
  const otherCollectiblesSlugs = useMemoWithCompare(
    () =>
      collectibles
        .filter(({ visibility }) => visibility !== VisibilityEnum.Visible)
        .map(({ slug }) => slug)
        .sort(),
    [collectibles],
    isEqual
  );
  const prevAccountPkhRef = useRef(accountPkh);
  const prevVisibleCollectiblesSlugsRef = useRef<string[]>([]);
  const prevOtherCollectiblesSlugsRef = useRef<string[]>([]);
  const collectiblesDetailsAreLoading = useCollectiblesDetailsLoadingSelector();

  const dispatch = useDispatch();

  useAuthorisedInterval(
    () => {
      // TODO: Is it necessary for collectibles on non-Mainnet networks too?
      if (prevAccountPkhRef.current !== accountPkh) {
        prevAccountPkhRef.current = accountPkh;
        prevVisibleCollectiblesSlugsRef.current = [];
        prevOtherCollectiblesSlugsRef.current = [];
      }

      [
        { slugs: visibleCollectiblesSlugs, prevRef: prevVisibleCollectiblesSlugsRef },
        { slugs: otherCollectiblesSlugs, prevRef: prevOtherCollectiblesSlugsRef }
      ].forEach(({ slugs, prevRef }) => {
        const slugsAreSame = isEqual(slugs, prevRef.current);
        if (slugs.length && (!collectiblesDetailsAreLoading || !slugsAreSame)) {
          const slugsToLoad = slugsAreSame ? slugs : difference(slugs, prevRef.current);
          prevRef.current = slugs;
          dispatch(loadCollectiblesDetailsActions.submit(slugsToLoad));
        }
      });
    },
    COLLECTIBLES_DETAILS_SYNC_INTERVAL,
    [visibleCollectiblesSlugs, otherCollectiblesSlugs, accountPkh]
  );
};
