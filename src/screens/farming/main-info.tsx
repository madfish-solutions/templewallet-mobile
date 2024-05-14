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
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useAllFarms, useLastFarmsStakes } from 'src/store/farms/selectors';
import { navigateAction } from 'src/store/root-state.actions';
import { useFiatToUsdRateSelector } from 'src/store/settings/settings-selectors';
import { isDefined } from 'src/utils/is-defined';
import { mutezToTz } from 'src/utils/tezos.util';
import { parseTransferParamsToParamsWithKind } from 'src/utils/transfer-params.utils';

export const MainInfo: FC = () => {
  const dispatch = useDispatch();
  const farms = useAllFarms();
  const stakes = useLastFarmsStakes();
  const tezos = useReadOnlyTezosToolkit();
  const fiatToUsdExchangeRate = useFiatToUsdRateSelector();

  const stakesEntriesWithEndedRewards = useMemo(() => {
    const now = Date.now();

    return Object.entries(stakes).filter((value): value is [string, UserStakeValueInterface] => {
      const [contractAddress, stakeRecord] = value;

      return (
        isDefined(stakeRecord) &&
        new BigNumber(stakeRecord.claimableRewards ?? DEFAULT_AMOUNT).isGreaterThan(DEFAULT_AMOUNT) &&
        (!isDefined(stakeRecord.rewardsDueDate) || stakeRecord.rewardsDueDate < now) &&
        farms.some(farm => farm.contractAddress === contractAddress)
      );
    });
  }, [stakes, farms]);

  const { netApr, totalStakedAmountInFiat } = useUserFarmingStats();

  const totalClaimableRewardsInFiat = useMemo(() => {
    let result = new BigNumber(0);

    stakesEntriesWithEndedRewards.forEach(([address, stakeRecord]) => {
      const farm = farms.find(_farm => _farm.contractAddress === address);

      if (isDefined(farm)) {
        result = result.plus(
          mutezToTz(new BigNumber(stakeRecord.claimableRewards ?? DEFAULT_AMOUNT), farm.rewardToken.metadata.decimals)
            .multipliedBy(farm.earnExchangeRate ?? DEFAULT_AMOUNT)
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
