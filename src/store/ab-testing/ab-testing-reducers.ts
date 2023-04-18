import { createReducer } from '@reduxjs/toolkit';

import { getUserTestingGroupNameActions } from './ab-testing-actions';
import { ABTestingState, abTestingInitialState } from './ab-testing-state';

export const abTestingReducer = createReducer<ABTestingState>(abTestingInitialState, builder => {
  builder.addCase(getUserTestingGroupNameActions.success, (state, { payload: testingGroupName }) => ({
    ...state,
    groupName: testingGroupName
  }));
});
