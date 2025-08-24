import { BigNumber } from 'bignumber.js';

import { CycleStatus } from '../utils/get-cycle-status-icon';

export interface BakingHistoryEntry {
  cycle: number;
  bakerAddress: string;
  bakerName?: string;
  delegated: BigNumber;
  bakerFeeRatio: number;
  bakerFee: BigNumber;
  expectedPayout: BigNumber;
  efficiency: BigNumber;
  luck: BigNumber;
  blockRewards: BigNumber;
  blocks: number;
  blockFees: BigNumber;
  missedBlockRewards: BigNumber;
  missedBlocks: number;
  missedBlockFees: BigNumber;
  attestationRewards: BigNumber;
  attestations: number;
  missedAttestations: number;
  missedAttestationRewards: BigNumber;
  status: CycleStatus;
}
