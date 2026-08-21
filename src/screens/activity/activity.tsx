import React, { useCallback, useState } from 'react';

import { ActivityFeedList } from 'src/components/activity-feed/activity-feed-list';
import { useActivityFeed } from 'src/hooks/use-activity-feed.hook';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

export const Activity = () => {
  const { activities, isInitialLoading, isLoadingMore, isEmpty, isAllErrored, isAllLoaded, handleLoadMore, refresh } =
    useActivityFeed();

  const [isRefreshing, setIsRefreshing] = useState(false);

  usePageAnalytic(ScreensEnum.Activity);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refresh().finally(() => setIsRefreshing(false));
  }, [refresh]);

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
