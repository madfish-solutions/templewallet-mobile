import { useEffect, useState } from 'react';

import { useSelectedAccountSelector } from '../store/wallet/wallet-selectors';
import { useReadOnlyTezosToolkit } from './use-read-only-tezos-toolkit.hook';

export const useIsFA2Token = (address: string) => {
  const selectedAccount = useSelectedAccountSelector();
  const tezos = useReadOnlyTezosToolkit(selectedAccount);

  const [loading, setLoading] = useState(false);
  const [isFa2, setIsFa2] = useState(false);

  useEffect(() => {
    async function getTokenStandart() {
      try {
        setLoading(true);
        const contract = await tezos.contract.at(address);
        const isTokenFa2 = contract.methods.update_operators;
        setIsFa2(Boolean(isTokenFa2));
      } catch (error) {
        setLoading(false);
      }
      setLoading(false);
    }

    getTokenStandart();
  }, []);

  return [isFa2, loading];
};
