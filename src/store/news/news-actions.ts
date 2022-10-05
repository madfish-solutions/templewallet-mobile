import { createAction } from '@reduxjs/toolkit';

import { NewsNotificationInterface } from '../../interfaces/news.interface';
import { createActions } from '../create-actions';

export const loadNewsAction = createActions<void, Array<NewsNotificationInterface>>('news/LOAD_NEWS');
export const readNewsAction = createAction<string>('news/READ_NEWS');
export const loadMoreNewsAction = createActions<void, Array<NewsNotificationInterface>>('news/LOAD_MORE_NEWS');
