import React from 'react';

import { ActivityFeedList } from 'src/components/activity-feed/activity-feed-list';
import { useActivityFeed } from 'src/hooks/use-activity-feed.hook';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

export const Activity = () => {
  const {
    activities,
    isInitialLoading,
    isLoadingMore,
    isEmpty,
    isAllErrored,
    isAllLoaded,
    isRefreshing,
    handleLoadMore,
    handleRefresh
  } = useActivityFeed();

  usePageAnalytic(ScreensEnum.Activity);

  return (
    <ActivityFeedList
      activities={activities}
      isInitialLoading={isInitialLoading}
      isEmpty={isEmpty}
      isAllErrored={isAllErrored}
      isAllLoaded={isAllLoaded}
      isLoadingMore={isLoadingMore}
      isRefreshing={isRefreshing}
      withPromotion
      onEndReached={handleLoadMore}
      onRefresh={handleRefresh}
      pageName="Activity"
    />
  );
};
