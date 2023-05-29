import { TezosToolkit } from '@taquito/taquito';
import memoize from 'p-memoize';

export const getReadOnlyContract = memoize(
  async (contractAddress: string, tezos: TezosToolkit) => tezos.contract.at(contractAddress),
  {
    cacheKey: ([contractAddress, tezos]) => `${contractAddress}_${tezos.rpc.getRpcUrl()}`
  }
);
