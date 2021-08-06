import { uniqueId } from 'lodash-es';
import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Action } from 'ts-action';

import { PUSH_ACTION_NAME, pushAction } from './debug-actions';

const reduxActionEpic = (action$: Observable<Action>) =>
  action$.pipe(
    filter(({ type }) => type !== PUSH_ACTION_NAME),
    map(action => pushAction({ id: uniqueId(), timestamp: Date.now(), ...action }))
  );

export const debugEpics = combineEpics(reduxActionEpic);
