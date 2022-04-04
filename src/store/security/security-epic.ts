import { combineEpics } from 'redux-observable';
import { map, Observable, filter } from 'rxjs';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { MAX_PASSWORD_ATTEMPTS } from '../../config/security';
import { withSecurityState } from '../../utils/security.utils';
import { RootState } from '../create-store';
import { enterPassword, setPasswordLockTime } from './security-actions';

const setPasswordEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(enterPassword.fail),
    withSecurityState(state$),
    filter(([, { passwordAttempt }]) => passwordAttempt < MAX_PASSWORD_ATTEMPTS),
    map(() => setPasswordLockTime(Date.now()))
  );

export const securityEpic = combineEpics(setPasswordEpic);
