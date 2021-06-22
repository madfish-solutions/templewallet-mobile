import { BeaconErrorType, BeaconMessageType } from '@airgap/beacon-sdk';
import { compose, OpKind, WalletParamsWithKind } from '@taquito/taquito';
import { tzip12 } from '@taquito/tzip12';
import { tzip16 } from '@taquito/tzip16';
import { BigNumber } from 'bignumber.js';
import { combineEpics } from 'redux-observable';
import { EMPTY, from, Observable, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { betterCallDevApi } from '../../api.service';
import { BeaconHandler } from '../../beacon/beacon-handler';
import { ConfirmationTypeEnum } from '../../interfaces/confirm-payload/confirmation-type.enum';
import { GetAccountTokenBalancesResponseInterface } from '../../interfaces/get-account-token-balances-response.interface';
import { TokenMetadataSuggestionInterface } from '../../interfaces/token-metadata-suggestion.interface';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { StacksEnum } from '../../navigator/enums/stacks.enum';
import { showErrorToast, showSuccessToast } from '../../toast/toast.utils';
import { XTZ_TOKEN_METADATA } from '../../token/data/tokens-metadata';
import { currentNetworkId$, tezos$ } from '../../utils/network/network.util';
import { ReadOnlySigner } from '../../utils/read-only.signer.util';
import { mutezToTz } from '../../utils/tezos.util';
import { getTransferParams$ } from '../../utils/transfer-params.utils';
import { navigateAction } from '../root-state.actions';
import {
  approvePermissionRequestAction,
  loadEstimationsActions,
  loadTezosBalanceActions,
  loadTokenBalancesActions,
  loadTokenMetadataActions,
  sendAssetActions
} from './wallet-actions';

const loadTokenAssetsEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadTokenBalancesActions.submit),
    toPayload(),
    withLatestFrom(currentNetworkId$),
    switchMap(([address, currentNetworkId]) =>
      from(
        betterCallDevApi.get<GetAccountTokenBalancesResponseInterface>(
          `/account/${currentNetworkId}/${address}/token_balances`,
          {
            params: { size: 10, offset: 0 }
          }
        )
      ).pipe(
        map(({ data }) => loadTokenBalancesActions.success(data.balances)),
        catchError(err => of(loadTokenBalancesActions.fail(err.message)))
      )
    )
  );

const loadTezosAssetsEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadTezosBalanceActions.submit),
    toPayload(),
    withLatestFrom(tezos$),
    switchMap(([address, tezos]) =>
      from(tezos.tz.getBalance(address)).pipe(
        map(balance => loadTezosBalanceActions.success(mutezToTz(balance, XTZ_TOKEN_METADATA.decimals).toString())),
        catchError(err => of(loadTezosBalanceActions.fail(err.message)))
      )
    )
  );

const loadTokenMetadataEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadTokenMetadataActions.submit),
    toPayload(),
    withLatestFrom(tezos$),
    switchMap(([{ id, address }, tezos]) =>
      from(tezos.wallet.at(address, compose(tzip12, tzip16))).pipe(
        switchMap(contract => contract.tzip12().getTokenMetadata(id)),
        map((tokenMetadata: TokenMetadataSuggestionInterface) =>
          loadTokenMetadataActions.success({
            id,
            address,
            decimals: tokenMetadata.decimals,
            symbol: tokenMetadata.symbol ?? tokenMetadata.name?.substring(8) ?? '???',
            name: tokenMetadata.name ?? tokenMetadata.symbol ?? 'Unknown Token',
            iconUrl:
              tokenMetadata.thumbnailUri ??
              tokenMetadata.logo ??
              tokenMetadata.icon ??
              tokenMetadata.iconUri ??
              tokenMetadata.iconUrl
          })
        ),
        catchError(err => of(loadTokenMetadataActions.fail(err.message)))
      )
    )
  );

const sendAssetEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(sendAssetActions.submit),
    toPayload(),
    withLatestFrom(tezos$),
    switchMap(([{ asset, sender, receiverPublicKeyHash, amount }, tezos]) =>
      getTransferParams$(asset, sender, receiverPublicKeyHash, new BigNumber(amount), tezos).pipe(
        map((transferParams): WalletParamsWithKind[] => [{ ...transferParams, kind: OpKind.TRANSACTION }]),
        map(opParams =>
          navigateAction(ModalsEnum.Confirmation, { type: ConfirmationTypeEnum.InternalOperations, sender, opParams })
        )
      )
    )
  );

const loadEstimationsEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadEstimationsActions.submit),
    toPayload(),
    withLatestFrom(tezos$),
    switchMap(([{ sender, opParams }, tezos]) => {
      tezos.setSignerProvider(new ReadOnlySigner(sender.publicKeyHash, sender.publicKey));

      return from(tezos.estimate.batch(opParams.map(param => ({ ...param, source: sender.publicKeyHash })))).pipe(
        map(estimates =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          estimates.map(({ suggestedFeeMutez, storageLimit, minimalFeePerStorageByteMutez }: any) => ({
            suggestedFeeMutez,
            storageLimit,
            minimalFeePerStorageByteMutez
          }))
        ),
        map(loadEstimationsActions.success),
        catchError(err => {
          showErrorToast('Warning! The transaction is likely to fail!');

          return of(loadEstimationsActions.fail(err.message));
        })
      );
    })
  );

const approvePermissionRequestEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(approvePermissionRequestAction),
    toPayload(),
    switchMap(({ message, publicKey }) =>
      from(
        BeaconHandler.respond({
          type: BeaconMessageType.PermissionResponse,
          network: message.network,
          scopes: message.scopes,
          id: message.id,
          publicKey
        })
      ).pipe(
        map(() => {
          showSuccessToast('Successfully approved!');

          return navigateAction(StacksEnum.MainStack);
        }),
        catchError(err => {
          showErrorToast(err.message);

          return EMPTY;
        })
      )
    )
  );

const abortPermissionRequestEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(approvePermissionRequestAction),
    toPayload(),
    switchMap(({ message }) =>
      from(
        BeaconHandler.respond({
          type: BeaconMessageType.Error,
          id: message.id,
          errorType: BeaconErrorType.ABORTED_ERROR
        })
      ).pipe(
        map(() => {
          showSuccessToast('Connection aborted!');

          return navigateAction(StacksEnum.MainStack);
        }),
        catchError(err => {
          showErrorToast(err.message);

          return EMPTY;
        })
      )
    )
  );

export const walletEpics = combineEpics(
  loadTezosAssetsEpic,
  loadTokenAssetsEpic,
  loadTokenMetadataEpic,
  sendAssetEpic,
  loadEstimationsEpic,
  approvePermissionRequestEpic,
  abortPermissionRequestEpic
);
