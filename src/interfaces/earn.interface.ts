import BigNumber from 'bignumber.js';

import { BigMap } from './big-map.interface';

interface DepositTokenInterface {
  token_type: string;
  token_id: BigNumber;
  token_address: string;
}

export interface StakesValueInterface {
  stake: BigNumber;
  disc_factor: BigNumber;
  age_timestamp: string;
}

export interface FarmContractStorageInterface {
  administrators: BigMap<string, number>;
  current_rewards: BigNumber;
  deposit_token: DepositTokenInterface;
  deposit_token_is_v2: boolean;
  disc_factor: BigNumber;
  expected_rewards: BigNumber;
  last_rewards: BigNumber;
  last_stake_id: BigNumber;
  max_release_period: BigNumber;
  reward_token: DepositTokenInterface;
  sender: string;
  stakes: BigMap<BigNumber, StakesValueInterface>;
  stakes_owner_lookup: BigMap<string, Array<BigNumber>>;
  total_stake: BigNumber;
}
