import { combineEpics, Epic } from 'redux-observable';
import { concatMap, Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { RootState } from '../create-store';
import { emptyAction } from '../root-state.actions';
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
      if ('tokensMetadata' in rootState.wallet && rootState.wallet.tokensMetadata !== undefined) {
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
      if ('addTokenSuggestion' in rootState.wallet) {
        return deleteOldTokenSuggestion();
      }

      return emptyAction();
    })
  );

const migrateIsShownDomainNameEpic: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(migrateIsShownDomainName),
    withLatestFrom(state$),
    map(([, rootState]) => {
      if ('isShownDomainName' in rootState.wallet) {
        return deleteOldIsShownDomainName();
      }

      return emptyAction();
    })
  );

const migrateQuipuApyEpic: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(migrateQuipuApy),
    withLatestFrom(state$),
    map(([, rootState]) => {
      if ('quipuApy' in rootState.wallet) {
        return deleteOldQuipuApy();
      }

      return emptyAction();
    })
  );

export const migrationEpics = combineEpics(
  migrateTokensMetadataEpic,
  migrateTokenSuggestionEpic,
  migrateIsShownDomainNameEpic,
  migrateQuipuApyEpic
);
