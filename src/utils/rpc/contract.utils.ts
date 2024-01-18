import { TezosToolkit } from '@taquito/taquito';
import memoize from 'memoizee';

export const getReadOnlyContract = memoize(
  async (contractAddress: string, tezos: TezosToolkit) => tezos.contract.at(contractAddress),
  {
    normalizer: ([contractAddress, tezos]) => `${contractAddress}_${tezos.rpc.getRpcUrl()}`
  }
);
