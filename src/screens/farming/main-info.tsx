import { ParamsWithKind, TransferParams } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { isEmptyArray } from 'formik';
import React, { FC, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { EarnOpportunitiesMainInfo } from 'src/components/earn-opportunities-main-info';
import { DEFAULT_AMOUNT, DEFAULT_EXCHANGE_RATE } from 'src/config/earn-opportunities-main-info';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { useUserFarmingStats } from 'src/hooks/use-user-farming-stats';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useAllFarmsSelector, useLastFarmsStakesSelector } from 'src/store/farms/selectors';
import { navigateAction } from 'src/store/root-state.actions';
import { useFiatToUsdRateSelector } from 'src/store/settings/settings-selectors';
import { isDefined } from 'src/utils/is-defined';
import { mutezToTz } from 'src/utils/tezos.util';
import { parseTransferParamsToParamsWithKind } from 'src/utils/transfer-params.utils';

export const MainInfo: FC = () => {
  const dispatch = useDispatch();
  const farms = useAllFarmsSelector();
  const stakes = useLastFarmsStakesSelector();
  const tezos = useReadOnlyTezosToolkit();
  const fiatToUsdExchangeRate = useFiatToUsdRateSelector();

  const stakesEntriesWithEndedRewards = useMemo(() => {
    const now = Date.now();

    return Object.entries(stakes).filter(
      ([contractAddress, stakeRecord]) =>
        stakeRecord?.claimableRewards &&
        new BigNumber(stakeRecord.claimableRewards).isGreaterThan(DEFAULT_AMOUNT) &&
        (!stakeRecord.rewardsDueDate || stakeRecord.rewardsDueDate < now) &&
        farms.data.some(farm => farm.item.contractAddress === contractAddress)
    );
  }, [stakes, farms]);

  const { netApr, totalStakedAmountInFiat } = useUserFarmingStats();

  const totalClaimableRewardsInFiat = useMemo(() => {
    let result = new BigNumber(0);

    stakesEntriesWithEndedRewards.forEach(([address, stakeRecord]) => {
      const farm = farms.data.find(_farm => _farm.item.contractAddress === address);

      if (isDefined(farm)) {
        result = result.plus(
          mutezToTz(
            new BigNumber(stakeRecord.claimableRewards ?? DEFAULT_AMOUNT),
            farm.item.rewardToken.metadata.decimals
          )
            .multipliedBy(farm.item.earnExchangeRate ?? DEFAULT_AMOUNT)
            .multipliedBy(fiatToUsdExchangeRate ?? DEFAULT_EXCHANGE_RATE)
        );
      }
    });

    return result;
  }, [farms, stakesEntriesWithEndedRewards, fiatToUsdExchangeRate]);

  const areRewardsClaimable = useMemo(
    () => !isEmptyArray(stakesEntriesWithEndedRewards) && totalClaimableRewardsInFiat.isGreaterThan(0),
    [stakesEntriesWithEndedRewards, totalClaimableRewardsInFiat]
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
      stakesEntriesWithEndedRewards.map(([address, stakeRecord]) =>
        tezos.wallet
          .at(address)
          .then(contractInstance => contractInstance.methods.claim(stakeRecord.lastStakeId).toTransferParams())
      )
    );

    const opParams = claimAllRewardParams.map(parseTransferParamsToParamsWithKind).flat();

    if (areRewardsClaimable) {
      navigateHarvestFarm(opParams);
    }
  };

  return (
    <EarnOpportunitiesMainInfo
      claimAllRewards={claimAllRewards}
      shouldShowClaimRewardsButton
      totalClaimableRewardsInFiat={totalClaimableRewardsInFiat}
      netApr={netApr}
      totalStakedAmountInFiat={totalStakedAmountInFiat}
      areRewardsClaimable={areRewardsClaimable}
    />
  );
};
