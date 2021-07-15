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
import { ConfirmationTypeEnum } from '../../interfaces/confirm-payload/confirmation-type.enum';
import { GetAccountTokenBalancesResponseInterface } from '../../interfaces/get-account-token-balances-response.interface';
import { TokenMetadataSuggestionInterface } from '../../interfaces/token-metadata-suggestion.interface';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { StacksEnum } from '../../navigator/enums/stacks.enum';
import { showErrorToast, showSuccessToast } from '../../toast/toast.utils';
import { TEZ_TOKEN_METADATA } from '../../token/data/tokens-metadata';
import { currentNetworkId$, tezos$ } from '../../utils/network/network.util';
import { mutezToTz } from '../../utils/tezos.util';
import { getTransferParams$ } from '../../utils/transfer-params.utils';
import { sendTransaction$, withSelectedAccount } from '../../utils/wallet.utils';
import { navigateAction } from '../root-state.actions';
import {
  approveInternalOperationRequestAction,
  loadEstimationsActions,
  loadTezosBalanceActions,
  loadTokenBalancesActions,
  loadTokenMetadataActions,
  sendAssetActions
} from './wallet-actions';
import { WalletRootState } from './wallet-state';

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
        map(balance => loadTezosBalanceActions.success(mutezToTz(balance, TEZ_TOKEN_METADATA.decimals).toString())),
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
      from(tezos.contract.at(address, compose(tzip12, tzip16))).pipe(
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

const sendAssetEpic = (action$: Observable<Action>, state$: Observable<WalletRootState>) =>
  action$.pipe(
    ofType(sendAssetActions.submit),
    toPayload(),
    withLatestFrom(tezos$),
    withSelectedAccount(state$),
    switchMap(([[{ asset, receiverPublicKeyHash, amount }, tezos], selectedAccount]) =>
      getTransferParams$(asset, selectedAccount, receiverPublicKeyHash, new BigNumber(amount), tezos).pipe(
        map((transferParams): WalletParamsWithKind[] => [{ ...transferParams, kind: OpKind.TRANSACTION }]),
        map(opParams =>
          navigateAction(ModalsEnum.Confirmation, { type: ConfirmationTypeEnum.InternalOperations, opParams })
        )
      )
    )
  );

const loadEstimationsEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadEstimationsActions.submit),
    toPayload(),
    withLatestFrom(tezos$),
    switchMap(([{ sender, opParams }, tezos]) =>
      from(tezos.estimate.batch(opParams.map(param => ({ ...param, source: sender.publicKeyHash })))).pipe(
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
        map(() => {
          showSuccessToast('Successfully sent!');

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
  approveInternalOperationRequestEpic
);
