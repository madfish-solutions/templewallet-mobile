import { FarmVersionEnum } from 'src/apis/quipuswap/types';

export class GetFarmStakeError extends Error {
  constructor(public readonly farmId: string, public readonly farmVersion: FarmVersionEnum, message: string) {
    super(message);
  }
}
