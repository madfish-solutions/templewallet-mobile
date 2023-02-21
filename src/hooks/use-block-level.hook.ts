import { useEffect, useState } from 'react';

import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';

import { useReadOnlyTezosToolkit } from './use-read-only-tezos-toolkit.hook';

export const useBlockLevel = () => {
  const selectedAccount = useSelectedAccountSelector();
  const tezos = useReadOnlyTezosToolkit(selectedAccount);
  const [blockLevel, setBlockLevel] = useState<number>();

  useEffect(() => {
    const subscription = tezos.stream.subscribeBlock('head');
    subscription.on('data', block => {
      setBlockLevel(block.header.level);
    });

    return () => subscription.close();
  }, []);

  return blockLevel;
};
