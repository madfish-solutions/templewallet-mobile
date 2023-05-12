import React, { FC } from 'react';

import { FarmVersionEnum } from 'src/apis/quipuswap/types';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from 'src/components/divider/divider';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

export const Earn: FC = () => {
  const { navigate } = useNavigation();
  usePageAnalytic(ScreensEnum.Earn);

  return (
    <ScreenContainer>
      <ButtonLargePrimary
        title="Manage kUSD/USDt farming pool"
        onPress={() => navigate(ModalsEnum.ManageFarmingPool, { id: '1', version: FarmVersionEnum.V3 })}
      />
      <Divider size={formatSize(8)} />
      <ButtonLargePrimary
        title="Manage TEZ/uXTZ farming pool"
        onPress={() => navigate(ModalsEnum.ManageFarmingPool, { id: '6', version: FarmVersionEnum.V3 })}
      />
    </ScreenContainer>
  );
};
