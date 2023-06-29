import { OpKind } from '@taquito/rpc';
import { ParamsWithKind, TransferParams } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { isEmptyArray } from 'formik';
import React, { FC, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { EarnOpportunitiesMainInfo } from 'src/components/earn-opportunities-main-info';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { useUserFarmingStats } from 'src/hooks/use-user-farming-stats';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useFarmStoreSelector } from 'src/store/farms/selectors';
import { navigateAction } from 'src/store/root-state.actions';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { isDefined } from 'src/utils/is-defined';
import { mutezToTz } from 'src/utils/tezos.util';

import { DEFAULT_AMOUNT, PENNY } from './constants';

export const MainInfo: FC = () => {
  const dispatch = useDispatch();

  const farms = useFarmStoreSelector();
  const selectedAccount = useSelectedAccountSelector();
  const tezos = useReadOnlyTezosToolkit(selectedAccount);

  const farmsWithEndedRewards = useMemo(() => {
    const now = Date.now();

    return Object.entries(farms.lastStakes).filter(
      ([, stakeRecord]) =>
        new BigNumber(stakeRecord?.claimableRewards ?? 0).isGreaterThan(DEFAULT_AMOUNT) &&
        (stakeRecord?.rewardsDueDate ?? DEFAULT_AMOUNT) < now
    );
  }, [farms]);

  const { netApy, totalStakedAmountInFiat } = useUserFarmingStats();

  const totalClaimableRewardsInUsd = useMemo(() => {
    let result = new BigNumber(PENNY);

    farmsWithEndedRewards.forEach(([address, stakeRecord]) => {
      const farm = farms.allFarms.data.find(_farm => _farm.item.contractAddress === address);

      if (isDefined(farm)) {
        result = result.plus(
          mutezToTz(
            new BigNumber(stakeRecord.claimableRewards ?? DEFAULT_AMOUNT),
            farm.item.rewardToken.metadata.decimals
          ).multipliedBy(farm.item.earnExchangeRate ?? DEFAULT_AMOUNT)
        );
      }
    });

    return result;
  }, [farms, farmsWithEndedRewards]);

  const areSomeRewardsClaimable = useMemo(
    () => !isEmptyArray(farmsWithEndedRewards) && totalClaimableRewardsInUsd.isGreaterThan(PENNY),
    [farmsWithEndedRewards, totalClaimableRewardsInUsd]
  );

  const navigateHarvestFarm = useCallback(
    (opParams: Array<ParamsWithKind>) =>
      dispatch(
        navigateAction(ModalsEnum.Confirmation, {
          type: ConfirmationTypeEnum.InternalOperations,
          opParams,
          testID: 'CLAIM_REWARDS'
        })
      ),
    []
  );

  const claimAllRewards = async () => {
    const claimAllRewardParams: Array<TransferParams> = await Promise.all(
      farmsWithEndedRewards.map(([address, stakeRecord]) =>
        tezos.wallet
          .at(address)
          .then(contractInstance => contractInstance.methods.claim(stakeRecord.lastStakeId).toTransferParams())
      )
    );

    const opParams: Array<ParamsWithKind> = claimAllRewardParams.map(transferParams => ({
      ...transferParams,
      kind: OpKind.TRANSACTION
    }));

    if (areSomeRewardsClaimable) {
      navigateHarvestFarm(opParams);
    }
  };

  return (
    <EarnOpportunitiesMainInfo
      claimAllRewards={claimAllRewards}
      shouldShowClaimRewardsButton
      totalClaimableRewardsInUsd={totalClaimableRewardsInUsd}
      netApy={netApy}
      totalStakedAmountInFiat={totalStakedAmountInFiat}
    />
  );
};
