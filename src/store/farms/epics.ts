import { combineEpics, Epic } from 'redux-observable';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { getSingleV3Farm, getV3FarmsList } from 'src/apis/quipuswap-staking';
import { FarmVersionEnum, NetworkEnum } from 'src/apis/quipuswap-staking/types';
import { FarmContractStorageInterface } from 'src/interfaces/earn.interface';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { getLastElement } from 'src/utils/array.utils';
import { calculateYouvesFarmingRewards } from 'src/utils/earn.utils';
import { getAxiosQueryErrorMessage } from 'src/utils/get-axios-query-error-message';
import { isDefined } from 'src/utils/is-defined';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';
import { getBalance } from 'src/utils/token-balance.utils';
import { withSelectedAccount, withSelectedRpcUrl } from 'src/utils/wallet.utils';

import { RootState } from '../create-store';
import { loadAllFarmsActions, loadAllStakesActions, loadSingleFarmActions } from './actions';
import { LastUserStakeInterface } from './state';

const loadSingleFarm = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadSingleFarmActions.submit),
    switchMap(({ payload: { id, version } }) => {
      if (version === FarmVersionEnum.V3) {
        return from(getSingleV3Farm(NetworkEnum.Mainnet, id)).pipe(
          map(response => loadSingleFarmActions.success(response))
        );
      }

      throw new Error(`Farm version ${version} is not supported yet`);
    }),
    catchError(err => {
      showErrorToast({ description: getAxiosQueryErrorMessage(err) });

      return of(loadSingleFarmActions.fail());
    })
  );

const loadAllFarmsAndLastStake: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadAllFarmsActions.submit),
    switchMap(() =>
      from(getV3FarmsList(NetworkEnum.Mainnet)).pipe(
        map(response => loadAllFarmsActions.success(response)),
        withSelectedAccount(state$),
        withSelectedRpcUrl(state$),
        switchMap(async ([[farms, selectedAccount], rpcUrl]) => {
          const tezos = createReadOnlyTezosToolkit(rpcUrl, selectedAccount);

          const result: LastUserStakeInterface = {};

          for (const { item: farm } of farms.payload) {
            try {
              const farmContractInstance = await tezos.contract.at(farm.contractAddress);
              const farmContractStorage = await farmContractInstance.storage<FarmContractStorageInterface>();
              const stakesIds = await farmContractStorage.stakes_owner_lookup.get(selectedAccount.publicKeyHash);

              if (isDefined(stakesIds)) {
                const lastStakeId = getLastElement(stakesIds);
                const stakeAmount = await farmContractStorage.stakes.get(lastStakeId);

                if (isDefined(stakeAmount)) {
                  const rewardTokenContractInstance = await tezos.contract.at(farm.rewardToken.contractAddress);
                  const farmBalanceInRewardToken = await getBalance(
                    rewardTokenContractInstance,
                    farm.contractAddress,
                    farm.rewardToken.fa2TokenId
                  );
                  const { claimableReward, fullReward } = calculateYouvesFarmingRewards(
                    {
                      lastRewards: farmContractStorage.last_rewards.toFixed(),
                      discFactor: farmContractStorage.disc_factor,
                      vestingPeriodSeconds: farmContractStorage.max_release_period,
                      totalStaked: farmContractStorage.total_stake
                    },
                    farmBalanceInRewardToken,
                    stakeAmount
                  );

                  result[farm.contractAddress] = {
                    lastStakeId: lastStakeId.toFixed(),
                    depositAmountAtomic: stakeAmount.stake.toFixed(),
                    claimableRewards: claimableReward.toFixed(),
                    fullReward: fullReward.toFixed()
                  };
                }
              }
            } catch (error) {
              console.error('Error while loading farm stakes: ', farm.contractAddress);
            }
          }

          return loadAllStakesActions.success(result);
        })
      )
    ),
    catchError(err => {
      showErrorToast({ description: getAxiosQueryErrorMessage(err) });

      return of(loadAllFarmsActions.fail());
    })
  );

export const farmsEpics = combineEpics(loadSingleFarm, loadAllFarmsAndLastStake);
