import { useDispatch } from 'react-redux';

import { loadTokensApyActions } from '../store/d-apps/d-apps-actions';
import { useAuthorisedEffect } from './use-authorised-effect.hook';

export const useLoadTokensApy = () => {
  const dispatch = useDispatch();

  useAuthorisedEffect(() => dispatch(loadTokensApyActions.submit()));
};
