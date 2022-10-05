import { combineEpics } from 'redux-observable';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { PlatformType } from '../../interfaces/news.interface';
import { getNewsItems, withLoadedNews } from '../../utils/news.utils';
import { RootState } from '../create-store';
import { loadMoreNewsAction, loadNewsAction } from './news-actions';

const loadNewsEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadNewsAction.submit),
    switchMap(() =>
      from(
        getNewsItems({
          platform: PlatformType.Extension
        })
      ).pipe(
        map(data => loadNewsAction.success(data)),
        catchError(err => of(loadNewsAction.fail(err.message)))
      )
    )
  );

const loadMoreNewsEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadMoreNewsAction.submit),
    withLoadedNews(state$),
    switchMap(([, lastNews]) =>
      from(
        getNewsItems({
          platform: PlatformType.Extension,
          timeLt: new Date(lastNews[lastNews.length - 1].createdAt).getTime().toString()
        })
      ).pipe(
        map(data => loadNewsAction.success(data)),
        catchError(err => of(loadNewsAction.fail(err.message)))
      )
    )
  );

export const newsEpics = combineEpics(loadNewsEpic, loadMoreNewsEpic);
