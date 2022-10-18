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

type Payload = { payload: unknown; type: string };

export const getNewsItems$ = (lastNewsArr: Array<Payload | NewsInterface[]> | Payload) =>
  from(
    templeWalletApi.get<RequestParams, NewsInterface[]>('/news', {
      params: {
        platform: PlatformType.Mobile,
        timeLt:
          isDefined(lastNewsArr) &&
          Array.isArray(lastNewsArr) &&
          isDefined(lastNewsArr[1]) &&
          Array.isArray(lastNewsArr[1])
            ? new Date(lastNewsArr[1][lastNewsArr[1].length - 1].createdAt).getTime().toString()
            : undefined
      }
    })
  ).pipe(
    map(data => loadNewsAction.success(data)),
    catchError(err => of(loadNewsAction.fail(err.message)))
  );

export const withLoadedNews =
  <T>(state$: Observable<NewsRootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(
      withLatestFrom(state$, (value, { newsState }): [T, Array<NewsInterface>] => [value, newsState.news.data])
    );
