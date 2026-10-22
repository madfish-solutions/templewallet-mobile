import { useMemo } from 'react';

import { useAccountAddressForEvm, useAccountAddressForTezos } from 'src/store/wallet/wallet-selectors';

export const useBridgeAccountAddresses = () => {
  const tezosAddress = useAccountAddressForTezos();
  const evmAddress = useAccountAddressForEvm();

  return useMemo(
    () => (tezosAddress && evmAddress ? { tezosAddress, evmAddress } : undefined),
    [tezosAddress, evmAddress]
  );
};
