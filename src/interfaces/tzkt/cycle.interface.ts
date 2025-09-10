export interface TzktCycle {
  index: number;
  firstLevel: number;
  startTime: string;
  lastLevel: number;
  endTime: string;
  snapshotLevel: number;
  randomSeed: string;
  totalBakers: number;
  // The fields below are not available on Talentnet
  totalBakingPower: number;
  blockReward: number;
  blockBonusPerSlot: number;
  attestationRewardPerSlot: number;
  nonceRevelationReward: number;
  vdfRevelationReward: number;
}
