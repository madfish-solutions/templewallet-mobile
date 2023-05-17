import { createReducer } from '@reduxjs/toolkit';

import { isDefined } from 'src/utils/is-defined';

import { createEntity } from '../create-entity';
import { setSelectedAccountAction } from '../wallet/wallet-actions';
import {
  loadAllFarmsActions,
  loadAllStakesActions,
  loadSingleFarmActions,
  loadSingleFarmStakeActions
} from './actions';
import { farmsInitialState, FarmsState } from './state';

export const farmsReducer = createReducer<FarmsState>(farmsInitialState, builder => {
  builder.addCase(loadSingleFarmActions.submit, state => ({
    ...state,
    farms: createEntity(state.farms.data, true)
  }));

  builder.addCase(loadSingleFarmActions.success, (state, { payload: newItem }) => {
    console.log(
      'x2',
      { id: newItem.item.id, version: newItem.item.version },
      state.farms.data.list.map(({ item: { id, version } }) => ({ id, version }))
    );

    return {
      ...state,
      farms: createEntity({
        list: state.farms.data.list
          .filter(farm => farm.item.id !== newItem.item.id || farm.item.version !== newItem.item.version)
          .concat(newItem)
      })
    };
  });

  builder.addCase(loadSingleFarmActions.fail, (state, { payload: error }) => ({
    ...state,
    farms: createEntity(state.farms.data, false, error)
  }));

  builder.addCase(loadSingleFarmStakeActions.success, (state, { payload: { stake, farmAddress } }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [farmAddress]: _, ...otherStakes } = state.lastStakes;

    return {
      ...state,
      lastStakes: isDefined(stake)
        ? {
            ...otherStakes,
            [farmAddress]: stake
          }
        : otherStakes
    };
  });

  builder.addCase(loadAllFarmsActions.submit, state => ({
    ...state,
    allFarms: createEntity(state.allFarms.data, true)
  }));
  builder.addCase(loadAllFarmsActions.success, (state, { payload }) => ({
    ...state,
    allFarms: createEntity(payload, false)
  }));
  builder.addCase(loadAllFarmsActions.fail, (state, { payload }) => ({
    ...state,
    allFarms: createEntity(state.allFarms.data, false, payload)
  }));
  builder.addCase(loadAllStakesActions.success, (state, { payload }) => ({
    ...state,
    lastStakes: payload
  }));

  builder.addCase(setSelectedAccountAction, state => ({
    ...state,
    lastStakes: farmsInitialState.lastStakes
  }));
});
