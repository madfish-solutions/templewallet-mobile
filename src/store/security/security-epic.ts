import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { setPasswordAttempts } from './security-actions';

const setPasswordEpic = (action$: Observable<Action>) => action$.pipe(ofType(setPasswordAttempts));

export const securityEpic = combineEpics(setPasswordEpic);
