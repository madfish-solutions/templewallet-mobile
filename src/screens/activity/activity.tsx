import React from 'react';

import { ActivityGroupsList } from '../../components/activity-groups-list/activity-groups-list';
import { Divider } from '../../components/divider/divider';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { SearchInput } from '../../components/search-input/search-input';
import { useFilteredActivityGroups } from '../../hooks/use-filtered-activity-groups.hook';

export const Activity = () => {
  const { filteredActivityGroups, setSearchValue } = useFilteredActivityGroups();

  return (
    <>
      <SearchInput placeholder="Search by address" onChangeText={setSearchValue} />
      <ScreenContainer>
        <ActivityGroupsList activityGroups={filteredActivityGroups} />
        <Divider />
      </ScreenContainer>
    </>
  );
};
