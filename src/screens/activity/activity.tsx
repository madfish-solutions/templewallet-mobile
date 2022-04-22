import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ActivityGroupsList } from '../../components/activity-groups-list/activity-groups-list';
import { SearchInput } from '../../components/search-input/search-input';
import { useFilteredActivityGroups } from '../../hooks/use-filtered-activity-groups.hook';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { loadActivityGroupsActions } from '../../store/wallet/wallet-actions';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';

export const Activity = () => {
  const dispatch = useDispatch();
  const { filteredActivityGroups, setSearchValue } = useFilteredActivityGroups();

  usePageAnalytic(ScreensEnum.Activity);
  useEffect(() => void dispatch(loadActivityGroupsActions.submit()), []);

  return (
    <>
      <SearchInput placeholder="Search" onChangeText={setSearchValue} />
      <ActivityGroupsList activityGroups={filteredActivityGroups} />
    </>
  );
};
