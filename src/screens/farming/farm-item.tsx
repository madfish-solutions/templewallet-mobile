import { ParamsWithKind } from '@taquito/taquito';
import React, { FC, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { getHarvestAssetsTransferParams } from 'src/apis/quipuswap-staking';
import { SingleFarmResponse } from 'src/apis/quipuswap-staking/types';
import { EarnOpportunityItem } from 'src/components/earn-opportunity-item';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { navigateAction } from 'src/store/root-state.actions';
import { doAfterConfirmation } from 'src/utils/farm.utils';
import { isDefined } from 'src/utils/is-defined';

import { HARVEST_CONFIRMATION_TEXT } from './constants';

interface Props {
  farm: SingleFarmResponse;
  lastStakeRecord?: UserStakeValueInterface;
}

export const FarmItem: FC<Props> = ({ farm, lastStakeRecord }) => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const tezos = useReadOnlyTezosToolkit();

  const navigateToFarm = useCallback(
    () => navigate(ModalsEnum.ManageFarmingPool, { id: farm.item.id, contractAddress: farm.item.contractAddress }),
    [farm.item]
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
    if (isDefined(lastStakeId)) {
      const opParams = await getHarvestAssetsTransferParams(tezos, farm.item.contractAddress, lastStakeId);

      if ((lastStakeRecord?.rewardsDueDate ?? 0) > Date.now()) {
        doAfterConfirmation(HARVEST_CONFIRMATION_TEXT, 'Claim rewards', () => navigateHarvestFarm(opParams));
      } else {
        navigateHarvestFarm(opParams);
      }
    }
  }, [lastStakeRecord?.rewardsDueDate, lastStakeId, farm.item.contractAddress, tezos]);

  return (
    <EarnOpportunityItem
      item={farm.item}
      lastStakeRecord={lastStakeRecord}
      navigateToOpportunity={navigateToFarm}
      harvestRewards={harvestAssetsApi}
    />
  );
};
