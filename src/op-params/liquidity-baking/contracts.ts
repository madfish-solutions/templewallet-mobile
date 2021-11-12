import { ContractAbstraction, ContractProvider } from '@taquito/taquito';
import { useEffect, useState } from 'react';

import { useReadOnlyTezosToolkit } from '../../hooks/use-read-only-tezos-toolkit.hook';
import { useSelectedAccountSelector } from '../../store/wallet/wallet-selectors';
import { isDefined } from '../../utils/is-defined';

export const LIQUIDITY_BAKING_DEX_ADDRESS = 'KT1TxqZ8QtKvLu3V3JH7Gx58n7Co8pgtpQU5';
export const LIQUIDITY_BAKING_LP_TOKEN_ADDRESS = 'KT1AafHA1C1vk959wvHWBispY9Y2f3fxBUUo';
export const LIQUIDITY_BAKING_LP_TOKEN_ID = '';
export const LIQUIDITY_BAKING_TOKEN_ADDRESS = 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn';
export const LIQUIDITY_BAKING_TOKEN_ID = 0;

export const useContract = <C extends ContractAbstraction<ContractProvider>, S>(
  address: string,
  storageInitialValue: S
) => {
  const [contract, setContract] = useState<C>();
  const [storage, setStorage] = useState<S>(storageInitialValue);

  const selectedAccount = useSelectedAccountSelector();
  const tezos = useReadOnlyTezosToolkit(selectedAccount);

  useEffect(() => {
    (async () => {
      const newContract = await tezos.contract.at<C>(address);
      setContract(newContract);
      isDefined(newContract) && setStorage(await newContract.storage<S>());
    })();
  }, [address]);

  return { contract, storage };
};
