import { useEffect, useState } from 'react';

import { TokenTypeEnum } from '../interfaces/token-type.enum';
import { useSelectedAccountSelector } from '../store/wallet/wallet-selectors';
import { getTokenType } from '../token/utils/token.utils';

import { useReadOnlyTezosToolkit } from './use-read-only-tezos-toolkit.hook';

export const useTokenType = (address: string) => {
  const selectedAccount = useSelectedAccountSelector();
  const tezos = useReadOnlyTezosToolkit(selectedAccount);

  const [loading, setLoading] = useState<boolean>(false);
  const [tokenType, setTokenType] = useState<TokenTypeEnum>(TokenTypeEnum.FA_1_2);

  useEffect(() => {
    async function getTokenStandart() {
      try {
        setLoading(true);
        const contract = await tezos.contract.at(address);

        const type = getTokenType(contract);
        setTokenType(type);
      } catch (error) {
        setLoading(false);
      }
      setLoading(false);
    }

    getTokenStandart();
  }, []);

  return { tokenType, loading };
};
