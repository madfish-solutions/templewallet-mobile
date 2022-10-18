import { EmptyObject } from '@reduxjs/toolkit';

import { NewsInterface } from '../../interfaces/news.interface';
import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';
import { welcomeNewsNotifications } from './news-data';

export interface NewsState {
  news: LoadableEntityState<Array<NewsInterface>>;
  newsEnabled: boolean;
}

export const newsInitialState: NewsState = {
  news: createEntity(welcomeNewsNotifications),
  newsEnabled: true
};

export interface NewsRootState extends EmptyObject {
  newsState: NewsState;
}
