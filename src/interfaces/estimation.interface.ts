import { Estimate } from '@taquito/taquito/dist/types/contract/estimate';

export interface EstimationInterface
  extends Pick<Estimate, 'suggestedFeeMutez' | 'gasLimit' | 'storageLimit' | 'totalCost'> {
  minimalFeePerStorageByteMutez: number;
}
