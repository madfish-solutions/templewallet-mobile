import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { loadScamlistAction } from 'src/store/tokens-metadata/tokens-metadata-actions';
import { useIsAuthorisedSelector } from 'src/store/wallet/wallet-selectors';

export const useScamlistLoading = () => {
  const dispatch = useDispatch();
  const isAuthorized = useIsAuthorisedSelector();

  useEffect(() => {
    if (isAuthorized) {
      dispatch(loadScamlistAction.submit());
    }
  }, [isAuthorized]);
};
