import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { loadTokensApyActions } from '../store/d-apps/d-apps-actions';
import { useIsAuthorisedSelector } from '../store/wallet/wallet-selectors';

export const useLoadTokensApyHook = () => {
  const dispatch = useDispatch();
  const isAuthorised = useIsAuthorisedSelector();

  useEffect(() => {
    dispatch(loadTokensApyActions.submit());
  }, [isAuthorised]);
};
