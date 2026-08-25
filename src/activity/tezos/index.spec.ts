import type { TzktAlias, TzktTransactionOperation } from 'src/apis/tzkt/types';
import { SAPLING_CONTRACT_ADDRESS } from 'src/config/sapling';

import { ActivityOperKindEnum, ActivityOperTransferType } from '../types';

import { parseTezosOperationsGroup } from './index';

const ACCOUNT_ADDRESS = 'tz1L7QjtFG4KJBMZ8tppwMmTjMGwqxPFCSXM';
const CHAIN_ID = 'NetXdQprcVkpaWU';
const HASH = 'ooeG6QGF3ve88SSN3pL6WfnMZGDR2HhjtwhVL7MuVtfgtgWo9di';

const alias = (address: string): TzktAlias => ({ address });

const baseOp = (overrides: Partial<TzktTransactionOperation>): TzktTransactionOperation => ({
  type: 'transaction',
  id: 1,
  level: 1,
  timestamp: '2026-08-20T00:00:00Z',
  hash: HASH,
  sender: alias(ACCOUNT_ADDRESS),
  status: 'applied',
  target: alias(SAPLING_CONTRACT_ADDRESS),
  amount: 0,
  ...overrides
});

describe('parseTezosOperationsGroup - sapling direction', () => {
  it('keeps a shielding call as a shielded interaction, but treats an unshielding payout as a tez receive', () => {
    const shieldingOp = baseOp({
      id: 1,
      sender: alias(ACCOUNT_ADDRESS),
      target: alias(SAPLING_CONTRACT_ADDRESS),
      amount: 0
    });

    const payoutOp = baseOp({
      id: 2,
      sender: alias(SAPLING_CONTRACT_ADDRESS),
      target: alias(ACCOUNT_ADDRESS),
      amount: 100000
    });

    const activity = parseTezosOperationsGroup(
      { hash: HASH, operations: [shieldingOp, payoutOp] },
      CHAIN_ID,
      ACCOUNT_ADDRESS
    );

    expect(activity).not.toBeNull();
    expect(activity?.operations).toHaveLength(2);

    const [shieldingResult, payoutResult] = activity?.operations ?? [];

    expect(shieldingResult).toEqual(
      expect.objectContaining({ kind: ActivityOperKindEnum.interaction, isShielded: true })
    );

    expect(payoutResult).toEqual(
      expect.objectContaining({
        kind: ActivityOperKindEnum.transfer,
        type: ActivityOperTransferType.receive,
        assetSlug: 'tez',
        amountSigned: '100000'
      })
    );
  });
});
