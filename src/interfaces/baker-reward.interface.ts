type TzktQuoteCurrency = 'None' | 'Btc' | 'Eur' | 'Usd' | 'Cny' | 'Jpy' | 'Krw';

type TzktQuote = Partial<Record<TzktQuoteCurrency, number>>;

export interface BakerRewardInterface {
  cycle: number;
  balance: number;
  baker: {
    alias?: string;
    address: string;
  };
  stakingBalance: number;
  activeStake: number;
  selectedStake: number;
  expectedBlocks: number;
  expectedEndorsements: number;
  futureBlocks: number;
  futureBlockRewards: number;
  ownBlocks: number;
  blocks: number;
  blockRewards: number;
  missedBlocks: number;
  missedBlockRewards: number;
  ownBlockRewards: number;
  extraBlocks: number;
  extraBlockRewards: number;
  missedOwnBlocks: number;
  missedOwnBlockRewards: number;
  missedExtraBlocks: number;
  missedExtraBlockRewards: number;
  uncoveredOwnBlocks: number;
  uncoveredOwnBlockRewards: number;
  uncoveredExtraBlocks: number;
  uncoveredExtraBlockRewards: number;
  futureEndorsements: number;
  futureEndorsementRewards: number;
  endorsements: number;
  endorsementRewards: number;
  missedEndorsements: number;
  missedEndorsementRewards: number;
  uncoveredEndorsements: number;
  uncoveredEndorsementRewards: number;
  ownBlockFees: number;
  blockFees: number;
  missedBlockFees: number;
  extraBlockFees: number;
  missedOwnBlockFees: number;
  missedExtraBlockFees: number;
  uncoveredOwnBlockFees: number;
  uncoveredExtraBlockFees: number;
  doubleBakingRewards: number;
  doubleBakingLosses: number;
  doubleBakingLostDeposits: number;
  doubleBakingLostRewards: number;
  doubleEndorsingLosses: number;
  doubleBakingLostFees: number;
  doubleEndorsingRewards: number;
  doubleEndorsingLostDeposits: number;
  doubleEndorsingLostRewards: number;
  doubleEndorsingLostFees: number;
  doublePreendorsingRewards: number;
  doublePreendorsingLosses: number;
  revelationRewards: number;
  revelationLosses: number;
  revelationLostRewards: number;
  revelationLostFees: number;
  quote?: TzktQuote;
}
