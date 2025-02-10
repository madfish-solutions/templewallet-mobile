import { TezosToolkit } from '@taquito/taquito';
import memoize from 'memoizee';

export const getReadOnlyContract = memoize(
  async (contractAddress: string, tezos: TezosToolkit) => tezos.contract.at(contractAddress),
  {
    normalizer: ([contractAddress, tezos]) => `${contractAddress}_${tezos.rpc.getRpcUrl()}`
  }
);

export const getContractStorage = async <T>(tezos: TezosToolkit, contractAddress: string) => {
  const contract = await getReadOnlyContract(contractAddress, tezos);

  return contract.storage<T>();
};
