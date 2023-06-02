import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { addTokensMetadataAction } from 'src/store/tokens-metadata/tokens-metadata-actions';
import { LOCAL_MAINNET_TOKENS_METADATA } from 'src/token/data/tokens-metadata';

export const useTokensMetadataFixtures = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addTokensMetadataAction(LOCAL_MAINNET_TOKENS_METADATA));
  }, []);
};
