import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { loadSwapDexesAction, loadSwapTokensAction } from 'src/store/swap/swap-actions';
import { useIsAuthorisedSelector } from 'src/store/wallet/wallet-selectors';

export const useSwapTokensLoading = () => {
  const dispatch = useDispatch();
  const isAuthorized = useIsAuthorisedSelector();

  useEffect(() => {
    if (isAuthorized) {
      dispatch(loadSwapTokensAction.submit());
      dispatch(loadSwapDexesAction.submit());
    }
  }, [isAuthorized]);
};
