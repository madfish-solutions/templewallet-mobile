import { createAction } from '@reduxjs/toolkit';

import { NewsInterface } from '../../interfaces/news.interface';
import { createActions } from '../create-actions';

export const loadNewsAction = createActions<void, Array<NewsInterface>>('news/LOAD_NEWS');
export const readNewsAction = createAction<string[]>('news/READ_NEWS');
export const viewNewsAction = createAction<string[]>('news/VIEW_NEWS');
export const loadMoreNewsAction = createActions<void, Array<NewsInterface>>('news/LOAD_MORE_NEWS');

export const newsEnabledToggleAction = createAction<boolean>('news/NEWS_ENABLED_TOGGLE');
