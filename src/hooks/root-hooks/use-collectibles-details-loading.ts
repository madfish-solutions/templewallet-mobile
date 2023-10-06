import { isEqual } from 'lodash';
import { useDispatch } from 'react-redux';

import { COLLECTIBLES_DETAILS_SYNC_INTERVAL } from 'src/config/fixed-times';
import { loadCollectiblesDetailsActions } from 'src/store/collectibles/collectibles-actions';
import { useAccountCollectibles } from 'src/utils/assets/hooks';

import { useAuthorisedInterval } from '../use-authed-interval';
import { useMemoWithCompare } from '../use-memo-with-compare';

export const useCollectiblesDetailsLoading = () => {
  const collectibles = useAccountCollectibles();

  const slugs = useMemoWithCompare(() => collectibles.map(({ slug }) => slug).sort(), [collectibles], isEqual);

  const dispatch = useDispatch();

  useAuthorisedInterval(
    () => {
      // TODO: Is it necessary for collectibles on non-Mainnet networks too?
      if (slugs.length) {
        dispatch(loadCollectiblesDetailsActions.submit(slugs));
      }
    },
    COLLECTIBLES_DETAILS_SYNC_INTERVAL,
    [slugs]
  );
};
