import { Observable } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';

import type { RootState } from 'src/store/types';

export const withSelectedIsAnalyticsEnabled =
  <T>(state$: Observable<RootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(
      withLatestFrom(state$, (value, { settings }): [T, boolean] => [value, settings.isAnalyticsEnabled])
    );

export const withSelectedIsAuthorized =
  <T>(state$: Observable<RootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(withLatestFrom(state$, (value, { wallet }): [T, boolean] => [value, wallet.accounts.length > 0]));

export const withSelectedUserId =
  <T>(state$: Observable<RootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(withLatestFrom(state$, (value, { settings }): [T, string] => [value, settings.userId]));
