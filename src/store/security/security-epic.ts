import { combineEpics } from 'redux-observable';
import { map, Observable } from 'rxjs';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { withSecurityState } from '../../utils/security.utils';
import { RootState } from '../create-store';
import { setPasswordAttempts, setPasswordTimelock } from './security-actions';

const LAST_ATTEMPT = 3;

const setPasswordEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(setPasswordAttempts.submit),
    withSecurityState(state$),
    map(([, { passwordAttempt }]) =>
      passwordAttempt > LAST_ATTEMPT ? setPasswordTimelock.submit(Date.now()) : setPasswordAttempts.success()
    )
  );

export const securityEpic = combineEpics(setPasswordEpic);
