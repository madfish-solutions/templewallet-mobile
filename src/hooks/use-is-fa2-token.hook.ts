import { useSelectedAccountSelector } from '../store/wallet/wallet-selectors';
import { useReadOnlyTezosToolkit } from './use-read-only-tezos-toolkit.hook';

export const useIsFA2Token = async (address: string) => {
  const selectedAccount = useSelectedAccountSelector();
  const tezos = useReadOnlyTezosToolkit(selectedAccount);
  const contract = await tezos.contract.at(address);
  //   if (!contract) {
  //     return false;
  //   }
  const isFa2 = contract.methods.update_operators;

  return isFa2;
};
