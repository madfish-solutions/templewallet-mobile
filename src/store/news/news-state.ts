import { EmptyObject } from '@reduxjs/toolkit';

import { NewsNotificationInterface } from '../../interfaces/news.interface';
import { welcomeNewsNotifications } from './news-data';

export interface NewsState {
  news: Array<NewsNotificationInterface>;
  loading: boolean;
}

export const newsInitialState: NewsState = {
  news: welcomeNewsNotifications,
  loading: false
};

export interface NewsRootState extends EmptyObject {
  newsState: NewsState;
}
