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
  it('keeps a shielding call as a shielded interaction and parses an unshielding payout as a shielded tez receive', () => {
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
        amountSigned: '100000',
        isShielded: true
      })
    );
  });
});

describe('parseTezosOperationsGroup - self transfer', () => {
  it('parses a send-to-self as a single send operation', () => {
    const selfSendOp = baseOp({
      sender: alias(ACCOUNT_ADDRESS),
      target: alias(ACCOUNT_ADDRESS),
      amount: 250000
    });

    const activity = parseTezosOperationsGroup({ hash: HASH, operations: [selfSendOp] }, CHAIN_ID, ACCOUNT_ADDRESS);

    expect(activity).not.toBeNull();
    expect(activity?.operations).toHaveLength(1);

    expect(activity?.operations.at(0)).toEqual(
      expect.objectContaining({
        kind: ActivityOperKindEnum.transfer,
        type: ActivityOperTransferType.sendToAccount,
        fromAddress: ACCOUNT_ADDRESS,
        toAddress: ACCOUNT_ADDRESS,
        assetSlug: 'tez',
        amountSigned: '-250000'
      })
    );
  });
});
