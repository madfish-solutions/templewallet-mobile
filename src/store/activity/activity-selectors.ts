import { useSelector } from 'react-redux';

import { ActivityRootState, ActivityState } from './activity-state';

const useActivitySelector = () => useSelector<ActivityRootState, ActivityState>(({ activity }) => activity);

export const useActivityGroupsSelector = () => useActivitySelector().activityGroups.data;

export const usePendingOperationsSelector = () => useActivitySelector().pendingOperations;
