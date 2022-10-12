import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setLoadingAction } from '../store/settings/settings-actions';

export const useResetLoading = () => {
  const dispatch = useDispatch();

  useEffect(() => void dispatch(setLoadingAction(false)), []);
};
