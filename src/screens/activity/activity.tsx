import React from 'react';

import { ActivityGroupsList } from '../../components/activity-groups-list/activity-groups-list';
// import { SearchInput } from '../../components/search-input/search-input';
// import { useFilteredActivityGroups } from '../../hooks/use-filtered-activity-groups.hook';
import { useGeneralActivity } from '../../hooks/use-general-activity';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';

export const Activity = () => {
  // const { filteredActivityGroups, setSearchValue } = useFilteredActivityGroups();
  const { activities } = useGeneralActivity();

  usePageAnalytic(ScreensEnum.Activity);

  return (
    <>
      {/* <SearchInput placeholder="Search" onChangeText={setSearchValue} /> */}
      {/* <ActivityGroupsList activityGroups={filteredActivityGroups} /> */}
      <ActivityGroupsList activityGroups={activities} />
    </>
  );
};
