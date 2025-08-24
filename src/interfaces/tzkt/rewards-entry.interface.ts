export type TzktQuoteCurrency = 'None' | 'Btc' | 'Eur' | 'Usd' | 'Cny' | 'Jpy' | 'Krw';

export type TzktQuote = Partial<Record<TzktQuoteCurrency, number>>;

export interface TzktRewardsEntry {
  cycle: number;
  baker: {
    alias?: string;
    address: string;
  };
  delegatedBalance: number;
  stakedBalance?: number;
  stakedPseudotokens?: string;
  quote?: TzktQuote;
  bakerRewards: {
    expectedBlocks: number;
    expectedAttestations: number;
    futureBlocks: number;
    futureBlockRewards: number;
    blocks: number;
    missedBlocks: number;
    missedBlockRewards: number;
    blockFees: number;
    missedBlockFees: number;
    doublePreendorsingRewards: number;
    futureAttestations: number;
    futureAttestationRewards: number;
    attestations: number;
    missedAttestations: number;
    missedAttestationRewards: number;
    doubleBakingRewards: number;
    doubleEndorsingRewards: number;
    ownDelegatedBalance: number;
    ownStakedBalance: number;
    bakingPower: number;
    blockRewardsDelegated: number;
    blockRewardsStakedEdge: number;
    blockRewardsStakedOwn: number;
    blockRewardsStakedShared: number;
    doubleBakingLostExternalStaked: number;
    doubleBakingLostExternalUnstaked: number;
    doubleBakingLostStaked: number;
    doubleBakingLostUnstaked: number;
    doubleEndorsingLostExternalStaked: number;
    doubleEndorsingLostExternalUnstaked: number;
    doubleEndorsingLostStaked: number;
    doubleEndorsingLostUnstaked: number;
    doublePreendorsingLostExternalStaked: number;
    doublePreendorsingLostExternalUnstaked: number;
    doublePreendorsingLostStaked: number;
    doublePreendorsingLostUnstaked: number;
    attestationRewardsDelegated: number;
    attestationRewardsStakedEdge: number;
    attestationRewardsStakedOwn: number;
    attestationRewardsStakedShared: number;
    externalDelegatedBalance: number;
    externalStakedBalance: number;
    nonceRevelationLosses: number;
    nonceRevelationRewardsDelegated: number;
    nonceRevelationRewardsStakedEdge: number;
    nonceRevelationRewardsStakedOwn: number;
    nonceRevelationRewardsStakedShared: number;
    totalBakingPower: number;
    vdfRevelationRewardsDelegated: number;
    vdfRevelationRewardsStakedEdge: number;
    vdfRevelationRewardsStakedOwn: number;
    vdfRevelationRewardsStakedShared: number;
  };
}
