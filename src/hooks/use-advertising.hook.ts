import { useDispatch } from 'react-redux';

import { loadAdvertisingPromotionActions } from '../store/advertising/advertising-actions';
import { useAuthorisedEffect } from './use-authorised-effect.hook';

export const useAdvertising = () => {
  const dispatch = useDispatch();

  useAuthorisedEffect(() => dispatch(loadAdvertisingPromotionActions.submit()));
};
