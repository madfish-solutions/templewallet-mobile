import React, { FC } from 'react';

import { FarmVersionEnum } from 'src/apis/quipuswap-staking/types';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

export const Earn: FC = () => {
  const { navigate } = useNavigation();
  usePageAnalytic(ScreensEnum.Earn);

  return (
    <ButtonLargePrimary
      title="Manage farming pool"
      onPress={() => navigate(ModalsEnum.ManageFarmingPool, { id: '0', version: FarmVersionEnum.V3 })}
    />
  );
};
