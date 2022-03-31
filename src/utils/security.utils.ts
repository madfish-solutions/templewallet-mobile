import { Observable } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';

import { SecurityRootState, SecurityState } from '../store/security/security-state';

export const withSecurityState =
  <T>(state$: Observable<SecurityRootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(
      withLatestFrom(state$, (value, { security }): [T, SecurityState] => {
        const { passwordAttempt, passwordTimelock } = security;

        return [value, { passwordAttempt, passwordTimelock }];
      })
    );
