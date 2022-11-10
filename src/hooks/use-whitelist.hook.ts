import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { loadWhitelistAction } from '../store/tokens-metadata/tokens-metadata-actions';

export const useWhitelist = () => {
  const dispatch = useDispatch();

  useEffect(() => void dispatch(loadWhitelistAction.submit()), []);
};
