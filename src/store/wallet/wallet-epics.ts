import { OpKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { uniq } from 'lodash-es';
import { combineEpics } from 'redux-observable';
import { EMPTY, forkJoin, from, Observable, of } from 'rxjs';
import { catchError, concatMap, delay, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { betterCallDevApi, tzktApi } from '../../api.service';
import { ActivityTypeEnum } from '../../enums/activity-type.enum';
import { ConfirmationTypeEnum } from '../../interfaces/confirm-payload/confirmation-type.enum';
import { GetAccountTokenTransfersResponseInterface } from '../../interfaces/get-account-token-transfers-response.interface';
import { ParamsWithKind } from '../../interfaces/op-params.interface';
import { OperationInterface } from '../../interfaces/operation.interface';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { StacksEnum } from '../../navigator/enums/stacks.enum';
import { showErrorToast, showSuccessToast } from '../../toast/toast.utils';
import { getTokenSlug } from '../../token/utils/token.utils';
import { groupActivitiesByHash } from '../../utils/activity.utils';
import { mapOperationsToActivities } from '../../utils/operation.utils';
import { paramsToPendingActions } from '../../utils/params-to-actions.util';
import { createReadOnlyTezosToolkit, CURRENT_NETWORK_ID } from '../../utils/rpc/tezos-toolkit.utils';
import { loadAssetsBalances$, loadTezosBalance$, loadTokensWithBalance$ } from '../../utils/token-balance.utils';
import { loadTokenMetadata$, loadTokensWithBalanceMetadata$ } from '../../utils/token-metadata.utils';
import { getTransferParams$ } from '../../utils/transfer-params.utils';
import { mapTransfersToActivities } from '../../utils/transfer.utils';
import { sendTransaction$, withSelectedAccount, withSelectedRpcUrl } from '../../utils/wallet.utils';
import { loadSelectedBakerActions } from '../baking/baking-actions';
import { RootState } from '../create-store';
import { navigateAction } from '../root-state.actions';
import {
  addPendingOperation,
  addTokenMetadataAction,
  approveInternalOperationRequestAction,
  loadActivityGroupsActions,
  loadTezosBalanceActions,
  loadTokenBalancesActions,
  loadTokenMetadataActions,
  loadTokenSuggestionActions,
  sendAssetActions,
  waitForOperationCompletionAction
} from './wallet-actions';

const loadTokenAssetsEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadTokenBalancesActions.submit),
    withSelectedAccount(state$),
    withSelectedRpcUrl(state$),
    switchMap(([[, selectedAccount], rpcUrl]) =>
      loadTokensWithBalance$(selectedAccount.publicKeyHash).pipe(
        switchMap(tokensWithBalance => {
          const assetSlugs = uniq([
            ...selectedAccount.tokensList.map(token => token.slug),
            ...tokensWithBalance.map(tokenWithBalance =>
              getTokenSlug({
                address: tokenWithBalance.contract,
                id: tokenWithBalance.token_id
              })
            )
          ]);

          return forkJoin([
            loadAssetsBalances$(rpcUrl, selectedAccount.publicKeyHash, assetSlugs),
            loadTokensWithBalanceMetadata$(tokensWithBalance)
          ]);
        }),
        map(([balancesRecord, metadataList]) => loadTokenBalancesActions.success({ balancesRecord, metadataList })),
        catchError(err => of(loadTokenBalancesActions.fail(err.message)))
      )
    )
  );

const loadTezosBalanceEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadTezosBalanceActions.submit),
    withSelectedAccount(state$),
    withSelectedRpcUrl(state$),
    switchMap(([[, selectedAccount], rpcUrl]) =>
      loadTezosBalance$(rpcUrl, selectedAccount.publicKeyHash).pipe(
        map(balance => loadTezosBalanceActions.success(balance)),
        catchError(err => of(loadTezosBalanceActions.fail(err.message)))
      )
    )
  );

const loadTokenSuggestionEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadTokenSuggestionActions.submit),
    toPayload(),
    switchMap(({ id, address }) =>
      loadTokenMetadata$(address, id).pipe(
        concatMap(tokenMetadata => [
          loadTokenSuggestionActions.success(tokenMetadata),
          loadTokenMetadataActions.success(tokenMetadata)
        ]),
        catchError(err => of(loadTokenSuggestionActions.fail(err.message)))
      )
    )
  );

const loadTokenMetadataEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadTokenMetadataActions.submit),
    toPayload(),
    concatMap(({ id, address }) =>
      loadTokenMetadata$(address, id).pipe(
        map(tokenMetadata => loadTokenMetadataActions.success(tokenMetadata)),
        catchError(err => of(loadTokenMetadataActions.fail(err.message)))
      )
    )
  );

const sendAssetEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(sendAssetActions.submit),
    toPayload(),
    withSelectedAccount(state$),
    withSelectedRpcUrl(state$),
    switchMap(([[{ asset, receiverPublicKeyHash, amount }, selectedAccount], rpcUrl]) =>
      getTransferParams$(asset, rpcUrl, selectedAccount, receiverPublicKeyHash, new BigNumber(amount)).pipe(
        map((transferParams): ParamsWithKind[] => [{ ...transferParams, kind: OpKind.TRANSACTION }]),
        map(opParams =>
          navigateAction(ModalsEnum.Confirmation, { type: ConfirmationTypeEnum.InternalOperations, opParams })
        )
      )
    )
  );

const approveInternalOperationRequestEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(approveInternalOperationRequestAction),
    toPayload(),
    withSelectedAccount(state$),
    withSelectedRpcUrl(state$),
    switchMap(([[opParams, sender], rpcUrl]) =>
      sendTransaction$(rpcUrl, sender, opParams).pipe(
        switchMap(({ hash }) => {
          showSuccessToast({ description: 'Successfully sent!' });

          return [
            navigateAction(StacksEnum.MainStack),
            waitForOperationCompletionAction({ opHash: hash, sender }),
            addPendingOperation(paramsToPendingActions(opParams, hash, sender.publicKeyHash))
          ];
        }),
        catchError(err => {
          showErrorToast({ description: err.message });

          return EMPTY;
        })
      )
    )
  );

const BCD_INDEXING_DELAY = 15000;

const waitForOperationCompletionEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(waitForOperationCompletionAction),
    toPayload(),
    withSelectedRpcUrl(state$),
    switchMap(([{ opHash, sender }, rpcUrl]) =>
      from(createReadOnlyTezosToolkit(rpcUrl, sender).operation.createOperation(opHash)).pipe(
        switchMap(operation => operation.confirmation(1)),
        delay(BCD_INDEXING_DELAY),
        concatMap(() => [
          loadTezosBalanceActions.submit(),
          loadTokenBalancesActions.submit(),
          loadActivityGroupsActions.submit(),
          loadSelectedBakerActions.submit()
        ]),
        catchError(err => {
          showErrorToast({ description: err.message });

          return EMPTY;
        })
      )
    )
  );

const loadActivityGroupsEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadActivityGroupsActions.submit),
    withSelectedAccount(state$),
    switchMap(([, selectedAccount]) =>
      forkJoin([
        from(
          tzktApi.get<OperationInterface[]>(
            `accounts/${selectedAccount.publicKeyHash}/operations?limit=100&type=${ActivityTypeEnum.Delegation},${ActivityTypeEnum.Origination},${ActivityTypeEnum.Transaction}`
          )
        ).pipe(map(({ data }) => mapOperationsToActivities(selectedAccount.publicKeyHash, data))),
        from(
          betterCallDevApi.get<GetAccountTokenTransfersResponseInterface>(
            `/tokens/${CURRENT_NETWORK_ID}/transfers/${selectedAccount.publicKeyHash}`,
            { params: { max: 100, start: 0 } }
          )
        ).pipe(map(({ data }) => mapTransfersToActivities(selectedAccount.publicKeyHash, data.transfers)))
      ]).pipe(
        map(([operations, transfers]) => groupActivitiesByHash(operations, transfers)),
        map(activityGroups => loadActivityGroupsActions.success(activityGroups)),
        catchError(err => of(loadActivityGroupsActions.fail(err.message)))
      )
    )
  );

const addTokenMetadataEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(addTokenMetadataAction),
    concatMap(() => [
      loadTezosBalanceActions.submit(),
      loadTokenBalancesActions.submit(),
      loadActivityGroupsActions.submit(),
      loadSelectedBakerActions.submit()
    ])
  );

export const walletEpics = combineEpics(
  loadTezosBalanceEpic,
  loadTokenAssetsEpic,
  loadTokenSuggestionEpic,
  loadTokenMetadataEpic,
  sendAssetEpic,
  waitForOperationCompletionEpic,
  loadActivityGroupsEpic,
  approveInternalOperationRequestEpic,
  addTokenMetadataEpic
);
