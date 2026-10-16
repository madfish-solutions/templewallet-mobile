import BigNumber from 'bignumber.js';

import { EVM_TOKEN_SLUG } from 'src/token/interfaces/token-metadata.interface';
import { EvmNetworkEssentials } from 'src/types/networks';

import { EvmAssetStandard } from '../../types';
import { AssetsAmounts, isContractCallTransaction, TxEssentials } from '../helpers';

import { knownOperationsHandlers } from './handlers';

export { groupBalancesChangesByReceiver } from './group-balances-changes-by-receiver';
export type { EvmBalanceChange, EvmBalancesChangesGroup } from './group-balances-changes-by-receiver';

/** Returns the estimation of EVM balances changes of the `sender` assuming that they send the transaction themselves */
export const getEvmBalancesChanges = async (tx: TxEssentials, sender: HexString, network: EvmNetworkEssentials) => {
  const nativeAmount = new BigNumber((tx.value ?? 0).toString()).negated();
  const basicBalancesChanges: AssetsAmounts = {
    [EVM_TOKEN_SLUG]: {
      atomicAmount: nativeAmount,
      standard: EvmAssetStandard.NATIVE,
      receiver: tx.to && !nativeAmount.isZero() ? tx.to : undefined
    }
  };

  if (!isContractCallTransaction(tx)) {
    return basicBalancesChanges;
  }

  for (const handler of knownOperationsHandlers) {
    const additionalDeltas = await handler(tx, sender, network);

    if (additionalDeltas) {
      return { ...basicBalancesChanges, ...additionalDeltas };
    }
  }

  return basicBalancesChanges;
};
