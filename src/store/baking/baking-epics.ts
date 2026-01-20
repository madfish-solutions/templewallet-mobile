import retry from 'async-retry';
import { combineEpics } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ofType } from 'ts-action-operators';

import { BakerInterface, bakingBadApi, fetchBaker, buildUnknownBaker } from 'src/apis/baking-bad';
import type { AnyActionEpic } from 'src/store/types';
import { sendErrorAnalyticsEvent } from 'src/utils/analytics/analytics.util';
import { withUserAnalyticsCredentials } from 'src/utils/error-analytics-data.utils';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';
import { RPC_RETRY_OPTIONS } from 'src/utils/tezos.util';
import { withSelectedAccount, withSelectedRpcUrl } from 'src/utils/wallet.utils';

import { loadBakersListActions, loadSelectedBakerActions } from './baking-actions';

const loadSelectedBakerAddressEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadSelectedBakerActions.submit),
    withSelectedAccount(state$),
    withSelectedRpcUrl(state$),
    withUserAnalyticsCredentials(state$),
    switchMap(([[[, selectedAccount], rpcUrl], { userId, ABTestingCategory, isAnalyticsEnabled }]) => {
      const tezos = createReadOnlyTezosToolkit(rpcUrl, selectedAccount);
      let fetchedBakerAddress: string | nullish;

      return from(retry(() => tezos.rpc.getDelegate(selectedAccount.publicKeyHash), RPC_RETRY_OPTIONS)).pipe(
        switchMap(bakerAddress => {
          fetchedBakerAddress = bakerAddress;

          return bakerAddress
            ? from(fetchBaker(bakerAddress)).pipe(map(baker => baker || buildUnknownBaker(bakerAddress)))
            : of(null);
        }),
        map(baker => loadSelectedBakerActions.success(baker)),
        catchError(error => {
          console.error(error);

          if (isAnalyticsEnabled) {
            sendErrorAnalyticsEvent(
              'LoadSelectedBakerAddressEpicError',
              error,
              [selectedAccount.publicKeyHash],
              { userId, ABTestingCategory },
              { rpcUrl, fetchedBakerAddress }
            );
          }

          return of(loadSelectedBakerActions.fail(error.message));
        })
      );
    })
  );

const loadBakersListEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadBakersListActions.submit),
    withUserAnalyticsCredentials(state$),
    switchMap(([, { userId, ABTestingCategory, isAnalyticsEnabled }]) =>
      from(
        bakingBadApi.get<BakerInterface[]>('/bakers', {
          params: {
            status: 'active'
          }
        })
      ).pipe(
        map(({ data }) => loadBakersListActions.success(data)),
        catchError(error => {
          console.error(error);

          if (isAnalyticsEnabled) {
            sendErrorAnalyticsEvent('LoadBakersListEpicError', error, [], { userId, ABTestingCategory });
          }

          return of(loadBakersListActions.fail(error.message));
        })
      )
    )
  );

export const bakingEpics = combineEpics(loadSelectedBakerAddressEpic, loadBakersListEpic);
