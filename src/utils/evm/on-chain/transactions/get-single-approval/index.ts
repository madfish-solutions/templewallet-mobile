import { EvmNetworkEssentials } from 'src/types/networks';

import { isContractCallTransaction, TxEssentials } from '../helpers';

import { knownOperationsHandlers } from './handlers';

/** Returns the estimation of EVM single approval of the `sender` assuming that they send the transaction themselves */
export const getSingleApproval = async (tx: TxEssentials, sender: HexString, network: EvmNetworkEssentials) => {
  if (isContractCallTransaction(tx)) {
    for (const handler of knownOperationsHandlers) {
      const approval = await handler(tx, sender, network);
      if (approval) {
        return approval;
      }
    }
  }

  return null;
};
