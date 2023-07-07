import React, { FC, useCallback } from 'react';

import { EarnOpportunityItem } from 'src/components/earn-opportunity-item';
import { SavingsItem } from 'src/interfaces/earn-opportunity/savings-item.interface';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';

interface Props {
  item: SavingsItem;
  lastStakeRecord?: UserStakeValueInterface;
}

export const SavingsItemCard: FC<Props> = ({ item, lastStakeRecord }) => {
  const { navigate } = useNavigation();

  const navigateToOpportunity = useCallback(
    () => navigate(ModalsEnum.ManageSavingsPool, { id: item.id, contractAddress: item.contractAddress }),
    [item, navigate]
  );

  return (
    <EarnOpportunityItem item={item} lastStakeRecord={lastStakeRecord} navigateToOpportunity={navigateToOpportunity} />
  );
};
