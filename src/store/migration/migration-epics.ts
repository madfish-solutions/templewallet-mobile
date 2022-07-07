import { combineEpics, Epic } from 'redux-observable';
import { concatMap, Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { RootState } from '../create-store';
import {
  deleteOldIsShownDomainName,
  deleteOldQuipuApy,
  deleteOldTokensMetadata,
  deleteOldTokenSuggestion,
  migrateIsShownDomainName,
  migrateQuipuApy,
  migrateTokensMetadata,
  migrateTokenSuggestion,
  setNewTokensMetadata
} from './migration-actions';

const migrateTokensMetadataEpic: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(migrateTokensMetadata),
    withLatestFrom(state$),
    concatMap(([, rootState]) => {
      if (rootState.wallet.tokensMetadata !== undefined) {
        return [deleteOldTokensMetadata(), setNewTokensMetadata(rootState.wallet.tokensMetadata)];
      }

      return [];
    })
  );

const migrateTokenSuggestionEpic: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(migrateTokenSuggestion),
    withLatestFrom(state$),
    map(([, rootState]) => {
      if (rootState.wallet.addTokenSuggestion !== undefined) {
        return deleteOldTokenSuggestion();
      }

      return undefined;
    })
  );

const migrateIsShownDomainNameEpic: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(migrateIsShownDomainName),
    withLatestFrom(state$),
    map(([, rootState]) => {
      if (rootState.wallet.isShownDomainName !== undefined) {
        return deleteOldIsShownDomainName();
      }

      return undefined;
    })
  );

const migrateQuipuApyEpic: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(migrateQuipuApy),
    withLatestFrom(state$),
    map(([, rootState]) => {
      if (rootState.wallet.quipuApy !== undefined) {
        return deleteOldQuipuApy();
      }

      return undefined;
    })
  );

export const migrationEpics = combineEpics(
  migrateTokensMetadataEpic,
  migrateTokenSuggestionEpic,
  migrateIsShownDomainNameEpic,
  migrateQuipuApyEpic
);
