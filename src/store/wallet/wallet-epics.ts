import { OpKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { combineEpics } from 'redux-observable';
import { EMPTY, forkJoin, from, Observable, of } from 'rxjs';
import { catchError, concatMap, delay, map, switchMap, withLatestFrom } from 'rxjs/operators';
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
import { TEZ_TOKEN_METADATA } from '../../token/data/tokens-metadata';
import { getTokenSlug } from '../../token/utils/token.utils';
import { groupActivitiesByHash } from '../../utils/activity.utils';
import { currentNetworkId$, tezos$ } from '../../utils/network/network.util';
import { mapOperationsToActivities } from '../../utils/operation.utils';
import { paramsToPendingActions } from '../../utils/params-to-actions.util';
import { loadTokensBalances$, loadTokensWithBalance$ } from '../../utils/token-balance.utils';
import { loadTokenMetadata$, loadTokensWithBalanceMetadata$ } from '../../utils/token-metadata.utils';
import { getTransferParams$ } from '../../utils/transfer-params.utils';
import { mapTransfersToActivities } from '../../utils/transfer.utils';
import { sendTransaction$, withSelectedAccount } from '../../utils/wallet.utils';
import { loadSelectedBakerActions } from '../baking/baking-actions';
import { navigateAction } from '../root-state.actions';
import {
  addPendingOperation,
  approveInternalOperationRequestAction,
  loadActivityGroupsActions,
  loadTezosBalanceActions,
  loadTokenBalancesActions,
  loadTokenMetadataActions,
  loadTokenSuggestionActions,
  sendAssetActions,
  waitForOperationCompletionAction
} from './wallet-actions';
import { WalletRootState } from './wallet-state';

const loadTokenAssetsEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadTokenBalancesActions.submit),
    toPayload(),
    withLatestFrom(currentNetworkId$),
    switchMap(([accountPublicKeyHash, currentNetworkId]) =>
      loadTokensWithBalance$(currentNetworkId, accountPublicKeyHash).pipe(
        switchMap(tokensWithBalance =>
          forkJoin(
            loadTokensBalances$(
              accountPublicKeyHash,
              tokensWithBalance.map(tokenWithBalance =>
                getTokenSlug({
                  address: tokenWithBalance.contract,
                  id: tokenWithBalance.token_id
                })
              )
            ),
            loadTokensWithBalanceMetadata$(tokensWithBalance)
          )
        ),
        map(([balancesList, metadataList]) => loadTokenBalancesActions.success({ balancesList, metadataList })),
        catchError(err => of(loadTokenBalancesActions.fail(err.message)))
      )
    )
  );

const loadTezosBalanceEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadTezosBalanceActions.submit),
    toPayload(),
    switchMap(accountPublicKeyHash =>
      loadTokensBalances$(accountPublicKeyHash, [getTokenSlug(TEZ_TOKEN_METADATA)]).pipe(
        map(data => data[0] ?? '0'),
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

const sendAssetEpic = (action$: Observable<Action>, state$: Observable<WalletRootState>) =>
  action$.pipe(
    ofType(sendAssetActions.submit),
    toPayload(),
    withLatestFrom(tezos$),
    withSelectedAccount(state$),
    switchMap(([[{ token, receiverPublicKeyHash, amount }, tezos], selectedAccount]) =>
      getTransferParams$(token, selectedAccount, receiverPublicKeyHash, new BigNumber(amount), tezos).pipe(
        map((transferParams): ParamsWithKind[] => [{ ...transferParams, kind: OpKind.TRANSACTION }]),
        map(opParams =>
          navigateAction(ModalsEnum.Confirmation, { type: ConfirmationTypeEnum.InternalOperations, opParams })
        )
      )
    )
  );

const approveInternalOperationRequestEpic = (action$: Observable<Action>, state$: Observable<WalletRootState>) =>
  action$.pipe(
    ofType(approveInternalOperationRequestAction),
    toPayload(),
    withSelectedAccount(state$),
    switchMap(([opParams, sender]) =>
      sendTransaction$(sender, opParams).pipe(
        switchMap(({ hash }) => {
          showSuccessToast({ description: 'Successfully sent!' });

          return [
            navigateAction(StacksEnum.MainStack),
            waitForOperationCompletionAction({ opHash: hash, sender: sender.publicKeyHash }),
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

const waitForOperationCompletionEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(waitForOperationCompletionAction),
    toPayload(),
    withLatestFrom(tezos$),
    switchMap(([{ opHash, sender }, tezos]) =>
      from(tezos.operation.createOperation(opHash)).pipe(
        switchMap(operation => operation.confirmation(1)),
        delay(BCD_INDEXING_DELAY),
        concatMap(() => [
          loadTezosBalanceActions.submit(sender),
          loadTokenBalancesActions.submit(sender),
          loadActivityGroupsActions.submit(sender),
          loadSelectedBakerActions.submit(sender)
        ]),
        catchError(err => {
          showErrorToast({ description: err.message });

          return EMPTY;
        })
      )
    )
  );

const loadActivityGroupsEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadActivityGroupsActions.submit),
    toPayload(),
    withLatestFrom(currentNetworkId$),
    switchMap(([accountPublicKeyHash, currentNetworkId]) =>
      forkJoin([
        from(
          tzktApi.get<OperationInterface[]>(
            `accounts/${accountPublicKeyHash}/operations?limit=100&type=${ActivityTypeEnum.Delegation},${ActivityTypeEnum.Origination},${ActivityTypeEnum.Transaction}`
          )
        ).pipe(map(({ data }) => mapOperationsToActivities(accountPublicKeyHash, data))),
        from(
          betterCallDevApi.get<GetAccountTokenTransfersResponseInterface>(
            `/tokens/${currentNetworkId}/transfers/${accountPublicKeyHash}`,
            { params: { max: 100, start: 0 } }
          )
        ).pipe(map(({ data }) => mapTransfersToActivities(accountPublicKeyHash, data.transfers)))
      ]).pipe(
        map(([operations, transfers]) => groupActivitiesByHash(operations, transfers)),
        map(activityGroups => loadActivityGroupsActions.success(activityGroups)),
        catchError(err => of(loadActivityGroupsActions.fail(err.message)))
      )
    )
  );

export const walletEpics = combineEpics(
  loadTezosBalanceEpic,
  loadTokenAssetsEpic,
  loadTokenSuggestionEpic,
  loadTokenMetadataEpic,
  sendAssetEpic,
  waitForOperationCompletionEpic,
  loadActivityGroupsEpic,
  approveInternalOperationRequestEpic
);
