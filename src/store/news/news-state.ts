import { EmptyObject } from '@reduxjs/toolkit';

import { NewsInterface } from '../../interfaces/news.interface';
import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';
import { welcomeNewsNotifications } from './news-data';

export interface NewsState {
  news: LoadableEntityState<Array<NewsInterface>>;
}

export const newsInitialState: NewsState = {
  news: createEntity(welcomeNewsNotifications)
};

export interface NewsRootState extends EmptyObject {
  newsState: NewsState;
}
