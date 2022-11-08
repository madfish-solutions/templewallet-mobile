import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { loadTokensApyActions } from '../store/d-apps/d-apps-actions';

export const useLoadTokensApy = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadTokensApyActions.submit());
  }, []);
};
