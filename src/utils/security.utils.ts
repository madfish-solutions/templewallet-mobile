import { Observable } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';

import { SettingsRootState } from '../store/settings/settings-state';

export const withSelectedIsAnalyticsEnabled =
  <T>(state$: Observable<SettingsRootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(
      withLatestFrom(state$, (value, { settings }): [T, boolean] => [value, settings.isAnalyticsEnabled])
    );

export const withSelectedUserId =
  <T>(state$: Observable<SettingsRootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(withLatestFrom(state$, (value, { settings }): [T, string] => [value, settings.userId]));
