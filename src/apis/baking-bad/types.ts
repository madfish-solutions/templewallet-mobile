export type GetBakerResponseData = BakerInterface | null;

type BakerStatus = 'active' | 'closed' | 'not_responding';

interface BakerFeature {
  title: string;
  content: string;
}

export interface BakerInterface {
  address: string;
  name: string;
  status: BakerStatus;
  balance: number;
  features: BakerFeature[];
  delegation: {
    enabled: boolean;
    minBalance: number;
    fee: number;
    capacity: number;
    freeSpace: number;
    estimatedApy: number;
    features: BakerFeature[];
  };
  staking: {
    enabled: boolean;
    minBalance: number;
    fee: number;
    capacity: number;
    freeSpace: number;
    estimatedApy: number;
    features: BakerFeature[];
  };
  isUnknownBaker?: boolean;
}
