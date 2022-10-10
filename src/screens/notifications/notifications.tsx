import React, { useEffect, useMemo } from 'react';
import { FlatList, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';

import { DataPlaceholder } from '../../components/data-placeholder/data-placeholder';
import { StatusType } from '../../interfaces/news.interface';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { viewNewsAction } from '../../store/news/news-actions';
import { useIsEveryNewsSeenSelector, useNewsSelector } from '../../store/news/news-selectors';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { NewsItem } from './news/news-item';
import { useNotificationsStyles } from './notifications.styles';

const timeToSeenAllNews = 5 * 1000;

export const Notifications = () => {
  const styles = useNotificationsStyles();
  const isAllSeen = useIsEveryNewsSeenSelector();
  const news = useNewsSelector();
  const dispatch = useDispatch();

  const isShowPlaceholder = useMemo(() => news.length === 0, [news]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(viewNewsAction(news.filter(x => x.status === StatusType.New).map(x => x.id)));
    }, timeToSeenAllNews);

    return () => clearTimeout(timer);
  }, [isAllSeen, news]);

  usePageAnalytic(ScreensEnum.Notifications);

  return (
    <ScrollView style={styles.contentWrapper}>
      {isShowPlaceholder ? (
        <DataPlaceholder text="Notifications not found" />
      ) : (
        <FlatList
          data={news}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <NewsItem key={item.id} {...item} />}
        />
      )}
    </ScrollView>
  );
};
