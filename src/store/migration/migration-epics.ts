import { combineEpics, Epic } from 'redux-observable';
import { concatMap, Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { KNOWN_TOKENS_SLUGS } from 'src/token/data/token-slugs';
import { PREDEFINED_DCP_TOKENS_METADATA } from 'src/token/data/tokens-metadata';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { isDefined } from 'src/utils/is-defined';

import { emptyAction } from '../root-state.actions';
import type { RootState } from '../types';
import {
  addDcpTokensMetadata,
  deleteOldIsShownDomainName,
  deleteOldQuipuApy,
  deleteOldTokensMetadata,
  deleteOldTokenSuggestion,
  migrateIsShownDomainName,
  migrateQuipuApy,
  migrateTokensMetadata,
  migrateTokenSuggestion,
  setNewTokensMetadata,
  updateSirsTokenAction
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

      return [];
    })
  );

const addDcpTokensMetadataEpic: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(addDcpTokensMetadata),
    withLatestFrom(state$),
    concatMap(([, rootState]) => {
      const existingMetadataSlugs = Object.keys(rootState.tokensMetadata.metadataRecord);

      if (!existingMetadataSlugs.includes(APX_TOKEN_SLUG)) {
        const newTokensMetadata = { ...rootState.tokensMetadata.metadataRecord };

        PREDEFINED_DCP_TOKENS_METADATA.forEach(
          tokenMetadata => (newTokensMetadata[getTokenSlug(tokenMetadata)] = tokenMetadata)
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

const updateSirsTokenEpic: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(updateSirsTokenAction),
    withLatestFrom(state$),
    map(([, rootState]) => {
      const sirsToken = rootState.tokensMetadata.metadataRecord[KNOWN_TOKENS_SLUGS.SIRS];

      if (isDefined(sirsToken) && isDefined(sirsToken.symbol) && sirsToken.symbol !== 'SIRS') {
        const newTokensMetadata = {
          ...rootState.tokensMetadata.metadataRecord,
          [KNOWN_TOKENS_SLUGS.SIRS]: {
            ...sirsToken,
            decimals: 0,
            name: 'Sirius',
            symbol: 'SIRS',
            thumbnailUri: 'ipfs://QmNXQPkRACxaR17cht5ZWaaKiQy46qfCwNVT5FGZy6qnyp'
          }
        };

        return setNewTokensMetadata(newTokensMetadata);
      }

      return emptyAction();
    })
  );

export const migrationEpics = combineEpics(
  migrateTokensMetadataEpic,
  addDcpTokensMetadataEpic,
  migrateTokenSuggestionEpic,
  migrateIsShownDomainNameEpic,
  migrateQuipuApyEpic,
  updateSirsTokenEpic
);
