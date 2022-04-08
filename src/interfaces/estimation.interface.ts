import { Estimate } from '@taquito/taquito';

export interface EstimationInterface extends Pick<Estimate, 'suggestedFeeMutez' | 'gasLimit' | 'storageLimit'> {
  minimalFeePerStorageByteMutez: number;
}
