interface BakingBadStoryEntrypoint<T> {
  cycle: number;
  value: T;
}

type BakerStatus = 'active' | 'closed' | 'not_responding';

export interface BakingBadStory {
  address: string;
  name: BakingBadStoryEntrypoint<string>[];
  status: BakingBadStoryEntrypoint<BakerStatus>[];
  delegationEnabled: BakingBadStoryEntrypoint<boolean>[];
  delegationFee: BakingBadStoryEntrypoint<number>[];
  delegationMinBalance: BakingBadStoryEntrypoint<number>[];
  stakingEnabled: BakingBadStoryEntrypoint<boolean>[];
  stakingFee: BakingBadStoryEntrypoint<number>[];
  stakingLimit: BakingBadStoryEntrypoint<number>[];
}

export interface BakingBadGetBakerParams {
  address: string;
}

export type BakingBadStoryResponse = BakingBadStory | null;
