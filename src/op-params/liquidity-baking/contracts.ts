import { ContractAbstraction, ContractProvider } from '@taquito/taquito';
import { useEffect, useState } from 'react';

import { useReadOnlyTezosToolkit } from '../../hooks/use-read-only-tezos-toolkit.hook';
import { useSelectedAccountSelector } from '../../store/wallet/wallet-selectors';
import { LIQUIDITY_BAKING_DEX_ADDRESS } from '../../token/data/token-slugs';
import { isDefined } from '../../utils/is-defined';
import { liquidityBakingStorageInitialValue } from './liquidity-baking-storage.interface';

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

/**
 *
 * @param bakingDexAddress - address of the liquidity baking dex contract
 * @returns contract instance of liquidity dex
 */
export const useLiquidityBakingContract = (bakingDexAddress = LIQUIDITY_BAKING_DEX_ADDRESS) => {
  const lpContract = useContract(bakingDexAddress, liquidityBakingStorageInitialValue);

  return lpContract;
};
