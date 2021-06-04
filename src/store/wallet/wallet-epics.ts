import { compose } from '@taquito/taquito';
import { tzip12 } from '@taquito/tzip12';
import { tzip16 } from '@taquito/tzip16';
import { combineEpics } from 'redux-observable';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { betterCallDevApi } from '../../api.service';
import { GetAccountTokenBalancesResponseInterface } from '../../interfaces/get-account-token-balances-response.interface';
import { TokenMetadataSuggestionInterface } from '../../interfaces/token-metadata-suggestion.interface';
import { TokenTypeEnum } from '../../interfaces/token-type.enum';
import { showSuccessToast } from '../../toast/toast.utils';
import { XTZ_TOKEN_METADATA } from '../../token/data/tokens-metadata';
import { assertFA2TokenContract } from '../../token/utils/token.utils';
import { currentNetworkId$, tezos$ } from '../../utils/network/network.util';
import { mutezToTz } from '../../utils/tezos.util';
import {
  loadTezosBalanceActions,
  loadTokenBalancesActions,
  loadTokenMetadataActions,
  confirmationActions
} from './wallet-actions';

const loadTokenAssetsEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadTokenBalancesActions.submit),
    toPayload(),
    withLatestFrom(currentNetworkId$),
    withLatestFrom(tezos$),
    switchMap(([[address, currentNetworkId], tezos]) =>
      from(
        betterCallDevApi.get<GetAccountTokenBalancesResponseInterface>(
          `/account/${currentNetworkId}/${address}/token_balances`,
          {
            params: { size: 10, offset: 0 }
          }
        )
      ).pipe(
        switchMap(({ data }) =>
          from(
            Promise.all(
              data.balances.map(async balance => {
                try {
                  await assertFA2TokenContract(await tezos.wallet.at(balance.contract));

                  return {
                    ...balance,
                    token_type: TokenTypeEnum.FA_2
                  };
                } catch (e) {
                  return {
                    ...balance,
                    token_type: TokenTypeEnum.FA_1_2
                  };
                }
              })
            )
          ).pipe(map(finalData => loadTokenBalancesActions.success(finalData)))
        ),
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
    switchMap(([{ id, address, type }, tezos]) =>
      from(tezos.wallet.at(address, compose(tzip12, tzip16))).pipe(
        switchMap(async contract => {
          try {
            return contract.tzip12().getTokenMetadata(id);
          } catch {
            const tzip16Metadata = await contract.tzip16().getMetadata();

            return {
              token_id: 0,
              decimals: 0,
              ...tzip16Metadata
            };
          }
        }),
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
              tokenMetadata.iconUrl,
            type
          })
        ),
        catchError(err => of(loadTokenMetadataActions.fail(err.message)))
      )
    )
  );

const operationConfirmationEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(confirmationActions.submit),
    toPayload(),
    withLatestFrom(tezos$),
    switchMap(([{ opHash, type }, tezos]) =>
      from(tezos.operation.createOperation(opHash)).pipe(
        switchMap(operation =>
          from(operation.confirmation(1)).pipe(
            map(({ completed }) => {
              if (!completed) {
                throw new Error('Unknown reason');
              }

              showSuccessToast('Operation confirmed!');

              return confirmationActions.success({
                opHash,
                type
              });
            })
          )
        ),
        catchError(err =>
          of(
            confirmationActions.fail({
              opHash,
              type,
              error: err.message
            })
          )
        )
      )
    )
  );

export const walletEpics = combineEpics(
  loadTezosAssetsEpic,
  loadTokenAssetsEpic,
  loadTokenMetadataEpic,
  operationConfirmationEpic
);
