import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { getUserTestingGroupNameActions } from '../store/ab-testing/ab-testing-actions';

export const useABTestingLoading = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserTestingGroupNameActions.submit());
  }, []);
};
