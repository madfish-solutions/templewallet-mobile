import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { loadScamlistAction } from 'src/store/tokens-metadata/tokens-metadata-actions';

export const useScamlistLoading = () => {
  const dispatch = useDispatch();

  useEffect(() => void dispatch(loadScamlistAction.submit()), []);
};
