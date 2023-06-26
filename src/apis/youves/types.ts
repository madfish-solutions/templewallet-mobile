import { BigNumber } from 'bignumber.js';

export interface SavingsPoolStorage {
  disc_factor: BigNumber;
  max_release_period: BigNumber;
  total_stake: BigNumber;
}
