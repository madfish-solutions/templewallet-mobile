import { createReducer } from '@reduxjs/toolkit';
import { uniqBy } from 'lodash-es';

import { StatusType } from '../../interfaces/news.interface';
import { createEntity } from '../create-entity';
import {
  loadMoreNewsAction,
  loadNewsAction,
  newsEnabledToggleAction,
  readNewsAction,
  viewNewsAction
} from './news-actions';
import { newsInitialState, NewsState } from './news-state';

export const newsReducer = createReducer<NewsState>(newsInitialState, builder => {
  builder.addCase(readNewsAction, (state, { payload }) => ({
    ...state,
    news: createEntity(state.news.data.map(n => (payload.indexOf(n.id) >= 0 ? { ...n, status: StatusType.Read } : n)))
  }));
  builder.addCase(viewNewsAction, (state, { payload }) => ({
    ...state,
    news: createEntity(state.news.data.map(n => (payload.indexOf(n.id) >= 0 ? { ...n, status: StatusType.Viewed } : n)))
  }));
  builder.addCase(loadNewsAction.submit, state => ({
    ...state,
    news: createEntity(state.news.data, true)
  }));
  builder.addCase(loadNewsAction.fail, state => ({
    ...state,
    news: createEntity(state.news.data, false)
  }));
  builder.addCase(loadNewsAction.success, (state, { payload }) => ({
    ...state,
    news: createEntity(
      uniqBy(
        payload.map(x => ({ ...x, status: StatusType.New })),
        'id'
      ),
      false
    )
  }));
  builder.addCase(loadMoreNewsAction.success, (state, { payload }) => ({
    ...state,
    news: createEntity(uniqBy([...state.news.data, ...payload.map(x => ({ ...x, status: StatusType.New }))], 'id'))
  }));

  builder.addCase(newsEnabledToggleAction, (state, { payload }) => ({
    ...state,
    newsEnabled: payload
  }));
});
