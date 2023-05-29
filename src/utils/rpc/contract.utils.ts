import { TezosToolkit } from '@taquito/taquito';
import memoize from 'mem';

export const getReadOnlyContract = memoize(
  async (contractAddress: string, tezos: TezosToolkit) => tezos.contract.at(contractAddress),
  {
    cacheKey: ([contractAddress, tezos]) => `${contractAddress}_${tezos.rpc.getRpcUrl()}`
  }
);
