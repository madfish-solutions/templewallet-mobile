import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { loadTokensApyActions } from '../store/d-apps/d-apps-actions';
import { useIsAuthorisedSelector } from '../store/wallet/wallet-selectors';

export const useLoadTokensApy = () => {
  const dispatch = useDispatch();
  const isAuthorised = useIsAuthorisedSelector();

  useEffect(() => {
    if (isAuthorised) {
      dispatch(loadTokensApyActions.submit());
    }
  }, [isAuthorised]);
};
