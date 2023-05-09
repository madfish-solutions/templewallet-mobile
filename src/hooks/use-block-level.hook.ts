import { useState } from 'react';

import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';

import { useInterval } from './use-interval.hook';
import { useReadOnlyTezosToolkit } from './use-read-only-tezos-toolkit.hook';

const BLOCK_POLLING_INTERVAL = 5000;

export const useBlockLevel = () => {
  const selectedAccount = useSelectedAccountSelector();
  const tezos = useReadOnlyTezosToolkit(selectedAccount);
  const [blockLevel, setBlockLevel] = useState<number>();

  useInterval(
    async () => {
      try {
        const { level: newLevel } = await tezos.rpc.getBlockHeader();
        setBlockLevel(newLevel);
      } catch {}
    },
    BLOCK_POLLING_INTERVAL,
    [tezos]
  );

  return blockLevel;
};
