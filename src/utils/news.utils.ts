import { from, Observable, of } from 'rxjs';
import { catchError, map, withLatestFrom } from 'rxjs/operators';

import { templeWalletApi } from '../api.service';
import { NewsInterface, PlatformType, SortedBy } from '../interfaces/news.interface';
import { loadNewsAction } from '../store/news/news-actions';
import { NewsRootState } from '../store/news/news-state';
import { isDefined } from './is-defined';

interface RequestParams {
  welcome?: boolean;
  platform?: PlatformType;
  limit?: string;
  page?: string;
  timeLt?: string;
  timeGt?: string;
  sorted?: SortedBy;
}

export const getNewsItems$ = (isEnabled: boolean, lastNews?: NewsInterface[]) => {
  if (isEnabled === false) {
    return of(loadNewsAction.fail('News not enabled'));
  }

  return from(
    templeWalletApi.get<RequestParams, NewsInterface[]>('/news', {
      params: {
        platform: PlatformType.Mobile,
        timeLt:
          isDefined(lastNews) && Array.isArray(lastNews)
            ? new Date(lastNews[lastNews.length - 1].createdAt).getTime().toString()
            : undefined
      }
    })
  ).pipe(
    map(data => loadNewsAction.success(data)),
    catchError(err => of(loadNewsAction.fail(err.message)))
  );
};

export const withLoadedNews =
  <T>(state$: Observable<NewsRootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(
      withLatestFrom(state$, (value, { newsState }): [T, Array<NewsInterface>] => [value, newsState.news.data])
    );

export const withNewsEnabled =
  <T>(state$: Observable<NewsRootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(withLatestFrom(state$, (value, { newsState }): [T, boolean] => [value, newsState.newsEnabled]));
