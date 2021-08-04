import { uniqueId } from 'lodash-es';
import { combineEpics } from 'redux-observable';
import { EMPTY, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';

import { DEBUG_ACTIONS_NAMES, pushAction } from './debug-actions';

const reduxActionEpic = (action$: Observable<Action>) =>
  action$.pipe(
    switchMap(action => {
      if (DEBUG_ACTIONS_NAMES.includes(action.type)) {
        return EMPTY;
      }

      return of(pushAction({ id: uniqueId(), timestamp: Date.now(), ...action }));
    })
  );

export const debugEpics = combineEpics(reduxActionEpic);
