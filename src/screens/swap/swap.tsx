import React, { FC } from 'react';

import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { SwapForm } from './swap-form/swap-form';

export const SwapScreen: FC = () => {
  usePageAnalytic(ScreensEnum.SwapScreen);

  return <SwapForm />;
};
