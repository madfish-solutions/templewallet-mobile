import { nanoid } from '@reduxjs/toolkit';
import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Action } from 'ts-action';

import { PUSH_RECENT_ACTION_NAME, pushRecentAction } from './debug-actions';

const reduxActionEpic = (action$: Observable<Action>) =>
  action$.pipe(
    filter(({ type }) => type !== PUSH_RECENT_ACTION_NAME),
    map(action => pushRecentAction({ id: nanoid(), timestamp: Date.now(), ...action }))
  );

export const debugEpics = combineEpics(reduxActionEpic);
