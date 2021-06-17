import { Estimate } from '@taquito/taquito/dist/types/contract/estimate';

export type EstimationInterface = Pick<Estimate, 'suggestedFeeMutez' | 'storageLimit'>;
