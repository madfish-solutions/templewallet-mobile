import { useMemo } from 'react';

import { getViemPublicClient } from 'src/utils/rpc/etherlink-client.utils';

export const useEtherlinkPublicClient = () => {
  // TODO: Add preferredRpcUrl when choosing RPC node becomes available
  return useMemo(() => getViemPublicClient(), []);
};
