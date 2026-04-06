import React, { FC, useCallback } from 'react';

import { EarnOpportunityItem } from 'src/components/earn-opportunity-item';
import { SavingsItem } from 'src/interfaces/earn-opportunity/savings-item.interface';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigateToModal } from 'src/navigator/hooks/use-navigation.hook';
import { useSavingsItemStakeWasLoadingSelector } from 'src/store/savings/selectors';

interface Props {
  item: SavingsItem;
  lastStakeRecord?: UserStakeValueInterface;
}

export const SavingsItemCard: FC<Props> = ({ item, lastStakeRecord }) => {
  const navigateToModal = useNavigateToModal();
  const stakeWasLoading = useSavingsItemStakeWasLoadingSelector(item.contractAddress);

  const navigateToOpportunity = useCallback(
    () => navigateToModal(ModalsEnum.ManageSavingsPool, { id: item.id, contractAddress: item.contractAddress }),
    [item, navigateToModal]
  );

  return (
    <EarnOpportunityItem
      item={item}
      lastStakeRecord={lastStakeRecord}
      navigateToOpportunity={navigateToOpportunity}
      stakeWasLoading={stakeWasLoading}
    />
  );
};
