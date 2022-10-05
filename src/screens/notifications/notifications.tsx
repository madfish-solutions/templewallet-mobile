import React, { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';

import { Label } from '../../components/label/label';
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

  useEffect(() => {
    if (!isAllSeen) {
      setTimeout(() => {
        dispatch(viewNewsAction(news.map(x => x.id)));
      }, timeToSeenAllNews);
    }
  }, [isAllSeen, news]);

  usePageAnalytic(ScreensEnum.Notifications);

  return (
    <ScrollView keyboardShouldPersistTaps={'never'} style={styles.contentWrapper}>
      <Label label="Slippage tolerance" />
      {news.map(n => {
        return <NewsItem key={n.id} {...n} />;
      })}
    </ScrollView>
  );
};
