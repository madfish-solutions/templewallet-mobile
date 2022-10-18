import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { getNewsItems$, withLoadedNews } from '../../utils/news.utils';
import { RootState } from '../create-store';
import { loadMoreNewsAction, loadNewsAction } from './news-actions';

const loadNewsEpic = (action$: Observable<Action>) =>
  action$.pipe(ofType(loadNewsAction.submit), switchMap(getNewsItems$));

const loadMoreNewsEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(ofType(loadMoreNewsAction.submit), withLoadedNews(state$), switchMap(getNewsItems$));

export const newsEpics = combineEpics(loadNewsEpic, loadMoreNewsEpic);
