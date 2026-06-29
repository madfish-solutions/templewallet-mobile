import { useEffect, useState } from 'react';

import { TokenStandardsEnum } from 'src/token/interfaces/token-metadata.interface';
import { getTokenStandard } from 'src/token/utils/token.utils';

import { useReadOnlyTezosToolkit } from './use-read-only-tezos-toolkit.hook';

export const useTokenStandard = (address: string) => {
  const tezos = useReadOnlyTezosToolkit();

  const [loading, setLoading] = useState<boolean>(false);
  const [tokenStandard, setTokenStandard] = useState<TokenStandardsEnum>(TokenStandardsEnum.Fa12);

  useEffect(() => {
    async function getCurrentTokenStandard() {
      try {
        setLoading(true);
        const contract = await tezos.contract.at(address);

        const type = getTokenStandard(contract);
        setTokenStandard(type);
      } catch {}
      setLoading(false);
    }

    getCurrentTokenStandard();
  }, []);

  return { tokenStandard, loading };
};
