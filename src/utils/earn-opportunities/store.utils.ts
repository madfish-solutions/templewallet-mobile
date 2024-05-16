import { Draft } from '@reduxjs/toolkit';

import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { FarmsState } from 'src/store/farms/state';
import { SavingsState } from 'src/store/savings/state';
import { LoadableEntityState } from 'src/store/types';

import { isDefined } from '../is-defined';

export const nullableEntityWasLoading = <T>(entity: LoadableEntityState<T | null | undefined> | undefined) => {
  return isDefined(entity) && (isDefined(entity.error) || entity.data !== undefined);
};

export const getStakeState = (
  state: Draft<SavingsState | FarmsState>,
  accountPkh: string,
  contractAddress: string
): Draft<LoadableEntityState<UserStakeValueInterface | null | undefined>> | undefined =>
  state.stakes[accountPkh]?.[contractAddress];

export const setStakeState = (
  state: Draft<SavingsState | FarmsState>,
  accountPkh: string,
  contractAddress: string,
  stake: LoadableEntityState<UserStakeValueInterface | null | undefined>
) => {
  if (!isDefined(state.stakes[accountPkh])) {
    state.stakes[accountPkh] = {};
  }

  state.stakes[accountPkh][contractAddress] = stake;
};
