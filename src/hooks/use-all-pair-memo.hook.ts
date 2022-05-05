import { useAllRoutePairs } from 'swap-router-sdk';

import { TEZOS_DEXES_API_URL } from '../screens/swap/config';

export const useAllPairMemo = () => {
  const value = useAllRoutePairs(TEZOS_DEXES_API_URL);

  return value;
};
