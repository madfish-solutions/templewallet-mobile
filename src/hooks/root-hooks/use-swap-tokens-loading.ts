import { useEffect } from 'react';

import { dispatch } from 'src/store';
import { loadEvmSwapTokensAction, loadSwapDexesAction, loadSwapTokensAction } from 'src/store/swap/swap-actions';
import { useIsAuthorisedSelector } from 'src/store/wallet/wallet-selectors';

export const useSwapTokensLoading = () => {
  const isAuthorized = useIsAuthorisedSelector();

  useEffect(() => {
    if (isAuthorized) {
      dispatch(loadSwapTokensAction.submit());
      dispatch(loadEvmSwapTokensAction.submit());
      dispatch(loadSwapDexesAction.submit());
    }
  }, [isAuthorized]);
};
