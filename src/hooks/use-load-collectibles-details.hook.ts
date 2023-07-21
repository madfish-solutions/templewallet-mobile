import { isEqual } from 'lodash';
import { useDispatch } from 'react-redux';
import { useCustomCompareMemo } from 'use-custom-compare';

import { COLLECTIBLES_DETAILS_SYNC_INTERVAL } from '../config/fixed-times';
import { loadCollectiblesDetailsActions } from '../store/collectibles/collectibles-actions';
import { useCollectiblesListSelector } from '../store/wallet/wallet-selectors';
import { getTokenSlug } from '../token/utils/token.utils';
import { useAuthorisedInterval } from './use-interval.hook';

export const useLoadCollectiblesDetails = () => {
  const dispatch = useDispatch();

  const collectiblesList = useCollectiblesListSelector();

  const collectiblesSlugs = useCustomCompareMemo(
    () => collectiblesList.map(collectible => getTokenSlug(collectible)).sort(),
    [collectiblesList],
    isEqual
  );
  useAuthorisedInterval(
    () => {
      dispatch(loadCollectiblesDetailsActions.submit(collectiblesSlugs));
    },
    COLLECTIBLES_DETAILS_SYNC_INTERVAL,
    [collectiblesSlugs]
  );
};
