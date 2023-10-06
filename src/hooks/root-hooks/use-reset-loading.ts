import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setIsShowLoaderAction } from 'src/store/settings/settings-actions';

export const useResetLoading = () => {
  const dispatch = useDispatch();

  useEffect(() => void dispatch(setIsShowLoaderAction(false)), []);
};
