import { RouteProp, useRoute } from '@react-navigation/native';
import React, { FC } from 'react';

import { ScreensEnum, ScreensParamList } from '../../navigator/enums/screens.enum';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { isDefined } from '../../utils/is-defined';
import { SwapForm } from './swap-form/swap-form';

export const SwapScreen: FC = () => {
  usePageAnalytic(ScreensEnum.SwapScreen);
  const { params } = useRoute<RouteProp<ScreensParamList, ScreensEnum.SwapScreen>>();

  return <SwapForm inputToken={isDefined(params) ? params.inputToken : undefined} />;
};
