import { useDispatch } from 'react-redux';

import { COLLECTIBLES_DETAILS_SYNC_INTERVAL } from '../config/fixed-times';
import { loadCollectiblesDetailsActions } from '../store/collectibles/collectibles-actions';
import { useSelectedRpcUrlSelector } from '../store/settings/settings-selectors';
import { useCollectiblesListSelector, useSelectedAccountSelector } from '../store/wallet/wallet-selectors';
import { getTokenSlug } from '../token/utils/token.utils';
import { useAuthorisedInterval } from './use-interval.hook';

export const useLoadCollectiblesDetails = () => {
  const dispatch = useDispatch();
  const { publicKeyHash: selectedAccountPkh } = useSelectedAccountSelector();
  const selectedRpcUrl = useSelectedRpcUrlSelector();

  const collectiblesList = useCollectiblesListSelector();

  const collectiblesSlugs = collectiblesList.map(collectible => getTokenSlug(collectible));

  useAuthorisedInterval(
    () => {
      dispatch(loadCollectiblesDetailsActions.submit(collectiblesSlugs));
    },
    COLLECTIBLES_DETAILS_SYNC_INTERVAL,
    [selectedAccountPkh, selectedRpcUrl, collectiblesSlugs.length]
  );
};
