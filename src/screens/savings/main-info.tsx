import React, { FC } from 'react';

import { EarnOpportunitiesMainInfo } from 'src/components/earn-opportunities-main-info';
import { useUserSavingsStats } from 'src/hooks/use-user-savings-stats';

export const MainInfo: FC = () => {
  const { netApy, totalStakedAmountInFiat } = useUserSavingsStats();

  return <EarnOpportunitiesMainInfo netApy={netApy} totalStakedAmountInFiat={totalStakedAmountInFiat} />;
};
