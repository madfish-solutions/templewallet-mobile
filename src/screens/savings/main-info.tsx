import React, { FC } from 'react';

import { EarnOpportunitiesMainInfo } from 'src/components/earn-opportunities-main-info';
import { useUserSavingsStats } from 'src/hooks/use-user-savings-stats';

export const MainInfo: FC = () => {
  const { netApr, totalStakedAmountInFiat } = useUserSavingsStats();

  return <EarnOpportunitiesMainInfo netApr={netApr} totalStakedAmountInFiat={totalStakedAmountInFiat} />;
};
