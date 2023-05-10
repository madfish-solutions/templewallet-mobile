import { FarmVersionEnum } from 'src/apis/quipuswap-staking/types';

export class GetFarmStakeError extends Error {
  constructor(public readonly farmId: string, public readonly farmVersion: FarmVersionEnum, message: string) {
    super(message);
  }
}
