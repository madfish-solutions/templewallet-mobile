import { EmptyObject } from '@reduxjs/toolkit';

import { NewsNotificationInterface } from '../../interfaces/news.interface';

export interface NewsState {
  news: Array<NewsNotificationInterface>;
  readNewsIds: Array<string>;
  loading: boolean;
}

export const newsInitialState: NewsState = {
  news: [],
  readNewsIds: [],
  loading: false
};

export interface NewsRootState extends EmptyObject {
  newsState: NewsState;
}
