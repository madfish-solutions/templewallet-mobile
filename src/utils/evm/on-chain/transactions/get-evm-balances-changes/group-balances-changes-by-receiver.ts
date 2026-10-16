import BigNumber from 'bignumber.js';

import { isDefined } from 'src/utils/is-defined';

import { EvmAssetStandard } from '../../types';
import { AssetsAmounts, stripZeroBalancesChanges } from '../helpers';

export interface EvmBalanceChange {
  assetSlug: string;
  /** Signed atomic amount (negative = outgoing). */
  amount: BigNumber;
  standard: EvmAssetStandard;
}

export interface EvmBalancesChangesGroup {
  receiver?: HexString;
  changes: EvmBalanceChange[];
}

/** Groups non-zero balance deltas by transfer recipient. */
export const groupBalancesChangesByReceiver = (balancesChanges: AssetsAmounts): EvmBalancesChangesGroup[] => {
  const groups = new Map<string, EvmBalancesChangesGroup>();

  for (const [assetSlug, { atomicAmount, standard, receiver }] of Object.entries(
    stripZeroBalancesChanges(balancesChanges)
  )) {
    const key = receiver?.toLowerCase() ?? '';
    const existingGroup = groups.get(key);

    if (isDefined(existingGroup)) {
      existingGroup.changes.push({ assetSlug, amount: atomicAmount, standard });
    } else {
      groups.set(key, {
        receiver,
        changes: [{ assetSlug, amount: atomicAmount, standard }]
      });
    }
  }

  return Array.from(groups.values());
};
