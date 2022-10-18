import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { getNewsItems$, withLoadedNews, withNewsEnabled } from '../../utils/news.utils';
import { RootState } from '../create-store';
import { loadMoreNewsAction, loadNewsAction } from './news-actions';

const loadNewsEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadNewsAction.submit),
    withNewsEnabled(state$),
    switchMap(([, isEnabled]) => getNewsItems$(isEnabled))
  );

const loadMoreNewsEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadMoreNewsAction.submit),
    withLoadedNews(state$),
    withNewsEnabled(state$),
    switchMap(([[, lastNews], isEnabled]) => getNewsItems$(isEnabled, lastNews))
  );

export const newsEpics = combineEpics(loadNewsEpic, loadMoreNewsEpic);
