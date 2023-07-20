import { ParamsWithKind } from '@taquito/taquito';
import React, { FC, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { getHarvestAssetsTransferParams } from 'src/apis/quipuswap-staking';
import { Farm } from 'src/apis/quipuswap-staking/types';
import { EarnOpportunityItem } from 'src/components/earn-opportunity-item';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { navigateAction } from 'src/store/root-state.actions';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { doAfterConfirmation } from 'src/utils/farm.utils';
import { isDefined } from 'src/utils/is-defined';

import { HARVEST_CONFIRMATION_TEXT } from './constants';

interface Props {
  farm: Farm;
  lastStakeRecord?: UserStakeValueInterface;
  stakeIsLoading: boolean;
}

export const FarmItem: FC<Props> = ({ farm, lastStakeRecord, stakeIsLoading }) => {
  const { id, contractAddress } = farm;
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const tezos = useReadOnlyTezosToolkit();
  const { trackEvent } = useAnalytics();

  const navigateToFarm = useCallback(
    () => navigate(ModalsEnum.ManageFarmingPool, { id: id, contractAddress: contractAddress }),
    [id, contractAddress, navigate]
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

  const lastStakeId = lastStakeRecord?.lastStakeId;
  const harvestAssetsApi = useCallback(async () => {
    if (!isDefined(lastStakeId)) {
      return;
    }

    const opParams = await getHarvestAssetsTransferParams(tezos, contractAddress, lastStakeId);

    if ((lastStakeRecord?.rewardsDueDate ?? 0) > Date.now()) {
      const modalAnswerAnalyticsProperties = {
        page: ScreensEnum.Farming,
        farmId: id,
        farmContractAddress: contractAddress
      };

      doAfterConfirmation(
        HARVEST_CONFIRMATION_TEXT,
        'Claim rewards',
        () => {
          trackEvent('CLAIM_REWARDS_MODAL_CONFIRM', AnalyticsEventCategory.ButtonPress, modalAnswerAnalyticsProperties);
          navigateHarvestFarm(opParams);
        },
        () =>
          trackEvent('CLAIM_REWARDS_MODAL_CANCEL', AnalyticsEventCategory.ButtonPress, modalAnswerAnalyticsProperties)
      );
    } else {
      navigateHarvestFarm(opParams);
    }
  }, [lastStakeId, lastStakeRecord?.rewardsDueDate, id, contractAddress, tezos, trackEvent]);

  return (
    <EarnOpportunityItem
      item={farm}
      lastStakeRecord={lastStakeRecord}
      navigateToOpportunity={navigateToFarm}
      harvestRewards={harvestAssetsApi}
      stakeIsLoading={stakeIsLoading}
    />
  );
};
