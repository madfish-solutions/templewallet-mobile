import React, { FC, useCallback } from 'react';
import { Alert } from 'react-native';

import { EarnOpportunityItem } from 'src/components/earn-opportunity-item';
import { SavingsItem } from 'src/interfaces/earn-opportunity/savings-item.interface';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';

interface Props {
  item: SavingsItem;
  lastStakeRecord?: UserStakeValueInterface;
}

export const SavingsItemCard: FC<Props> = ({ item, lastStakeRecord }) => {
  const navigateToOpportunity = useCallback(
    () => Alert.alert(`TODO: navigate to ${item.id} savings item, type: ${item.type}`),
    [item]
  );

  return (
    <EarnOpportunityItem item={item} lastStakeRecord={lastStakeRecord} navigateToOpportunity={navigateToOpportunity} />
  );
};
