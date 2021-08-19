import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ActivityGroupsList } from '../../components/activity-groups-list/activity-groups-list';
import { SearchInput } from '../../components/search-input/search-input';
import { useFilteredActivityGroups } from '../../hooks/use-filtered-activity-groups.hook';
import { loadActivityGroupsActions } from '../../store/wallet/wallet-actions';

export const Activity = () => {
  const dispatch = useDispatch();
  const { filteredActivityGroups, setSearchValue } = useFilteredActivityGroups();

  useEffect(() => void dispatch(loadActivityGroupsActions.submit()), []);

  return (
    <>
      <SearchInput placeholder="Search" onChangeText={setSearchValue} />
      <ActivityGroupsList activityGroups={filteredActivityGroups} />
    </>
  );
};
