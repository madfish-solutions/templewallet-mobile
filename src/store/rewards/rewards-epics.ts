import { BigNumber } from 'bignumber.js';
import { combineEpics } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { ofType, toPayload } from 'ts-action-operators';

import { tzktApi } from 'src/api.service';
import { TzktTokenTransfer } from 'src/interfaces/tzkt/token-transfer.interface';
import type { AnyActionEpic } from 'src/store/types';
import { TEMPLE_TOKEN_METADATA } from 'src/token/data/tokens-metadata';
import { ZERO } from 'src/utils/number.util';
import { mutezToTz } from 'src/utils/tezos.util';

import { loadTkeyRewardsStatsActions } from './rewards-actions';

const TEMPLE_REWARDS_PAYOUT_ADDRESS = 'tz1N7mkPWedKcMPHt9tgiA4SstDHS4L6LKKQ';
const TZKT_MAX_QUERY_ITEMS_LIMIT = 10_000;

const loadTkeyRewardsStatsEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadTkeyRewardsStatsActions.submit),
    toPayload(),
    withLatestFrom(state$),
    switchMap(([rewardsAddress, state]) => {
      const currentStats = state.rewards.tkeyStats.data;

      return from(
        tzktApi.get<TzktTokenTransfer[]>('/tokens/transfers', {
          params: {
            'sort.desc': 'id',
            to: rewardsAddress,
            from: TEMPLE_REWARDS_PAYOUT_ADDRESS,
            limit: TZKT_MAX_QUERY_ITEMS_LIMIT,
            'token.contract': TEMPLE_TOKEN_METADATA.address,
            'token.tokenId': TEMPLE_TOKEN_METADATA.id,
            ...(currentStats?.lastTransferTs ? { 'timestamp.gt': currentStats.lastTransferTs } : {})
          }
        })
      ).pipe(
        map(({ data: transfers }) => {
          const total = mutezToTz(
            transfers.reduce((sum, transfer) => sum.plus(transfer.amount), ZERO),
            TEMPLE_TOKEN_METADATA.decimals
          )
            .plus(currentStats?.total ?? ZERO)
            .toFixed();
          const lastAmount = transfers[0]
            ? mutezToTz(new BigNumber(transfers[0].amount), TEMPLE_TOKEN_METADATA.decimals).toFixed()
            : currentStats?.lastAmount;

          return loadTkeyRewardsStatsActions.success({
            total,
            lastAmount,
            lastTransferTs: transfers[0]?.timestamp ?? currentStats?.lastTransferTs
          });
        }),
        catchError(error => {
          console.error('Failed to load TKEY rewards stats:', error);

          return of(loadTkeyRewardsStatsActions.fail(error.message));
        })
      );
    })
  );

export const rewardsEpics = combineEpics(loadTkeyRewardsStatsEpic);
