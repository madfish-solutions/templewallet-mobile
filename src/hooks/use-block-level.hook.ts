import { useEffect, useState } from 'react';

import { useReadOnlyTezosToolkit } from './use-read-only-tezos-toolkit.hook';

export const useBlockLevel = () => {
  const tezos = useReadOnlyTezosToolkit();
  const [blockLevel, setBlockLevel] = useState<number>();

  useEffect(() => {
    const subscription = tezos.stream.subscribeBlock('head');
    subscription.on('data', block => {
      setBlockLevel(block.header.level);
    });

    return () => subscription.close();
  }, [tezos]);

  return blockLevel;
};
