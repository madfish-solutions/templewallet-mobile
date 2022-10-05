import { Observable } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';

import { templeWalletApi } from '../api.service';
import { NewsNotificationInterface, PlatformType, SortedBy } from '../interfaces/news.interface';
import { NewsRootState } from '../store/news/news-state';

interface RequestParams {
  welcome?: boolean;
  platform?: PlatformType;
  limit?: string;
  page?: string;
  timeLt?: string;
  timeGt?: string;
  sorted?: SortedBy;
}

export const getNewsItems = (params: RequestParams) =>
  templeWalletApi.get<RequestParams, NewsNotificationInterface[]>('/news', {
    params
  });

export const withLoadedNews =
  <T>(state$: Observable<NewsRootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(
      withLatestFrom(state$, (value, { newsState }): [T, Array<NewsNotificationInterface>] => [value, newsState.news])
    );
