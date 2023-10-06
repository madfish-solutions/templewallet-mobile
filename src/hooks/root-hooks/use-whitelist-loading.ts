import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { loadWhitelistAction } from '../../store/tokens-metadata/tokens-metadata-actions';

export const useWhitelistLoading = () => {
  const dispatch = useDispatch();

  useEffect(() => void dispatch(loadWhitelistAction.submit()), []);
};
