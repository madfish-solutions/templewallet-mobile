import { useMemo } from 'react';

import { getViemPublicClient } from 'src/utils/rpc/etherlink-client.utils';

export const useEtherlinkPublicClient = () => {
  return useMemo(() => getViemPublicClient(), []);
};
