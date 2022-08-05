import { combineEpics, Epic } from 'redux-observable';
import { concatMap, Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { DCP_TOKENS_METADATA } from '../../token/data/tokens-metadata';
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

const APX_TOKEN_SLUG = 'KT1N7Rh6SgSdExMPxfnYw1tHqrkSm7cm6JDN_0';

const migrateTokensMetadataEpic: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(migrateTokensMetadata),
    withLatestFrom(state$),
    concatMap(([, rootState]) => {
      if (rootState.wallet.tokensMetadata !== undefined) {
        return [deleteOldTokensMetadata(), setNewTokensMetadata(rootState.wallet.tokensMetadata)];
      }

      const existingMetadataSlugs = Object.keys(rootState.tokensMetadata.metadataRecord);

      if (!existingMetadataSlugs.includes(APX_TOKEN_SLUG)) {
        const newTokensMetadata = rootState.tokensMetadata.metadataRecord;

        DCP_TOKENS_METADATA.forEach(
          tokenMetadata => (newTokensMetadata[`${tokenMetadata.address}_${tokenMetadata.id}`] = tokenMetadata)
        );

        return [setNewTokensMetadata(newTokensMetadata)];
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

      return emptyAction();
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

      return emptyAction();
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

      return emptyAction();
    })
  );

export const migrationEpics = combineEpics(
  migrateTokensMetadataEpic,
  migrateTokenSuggestionEpic,
  migrateIsShownDomainNameEpic,
  migrateQuipuApyEpic
);
