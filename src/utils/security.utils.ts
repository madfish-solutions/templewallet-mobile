import { Observable } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';

import { SettingsRootState } from '../store/settings/settings-state';
import { WalletRootState } from '../store/wallet/wallet-state';

export const withSelectedIsAnalyticsEnabled =
  <T>(state$: Observable<SettingsRootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(
      withLatestFrom(state$, (value, { settings }): [T, boolean] => [value, settings.isAnalyticsEnabled])
    );

export const withSelectedIsAuthorized =
  <T>(state$: Observable<WalletRootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(withLatestFrom(state$, (value, { wallet }): [T, boolean] => [value, wallet.accounts.length > 0]));

export const withSelectedUserId =
  <T>(state$: Observable<SettingsRootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(withLatestFrom(state$, (value, { settings }): [T, string] => [value, settings.userId]));
