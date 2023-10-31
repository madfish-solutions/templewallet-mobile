import { RouteProp, useRoute } from '@react-navigation/native';
import React, { memo, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ScreensEnum, ScreensParamList } from 'src/navigator/enums/screens.enum';
import { resetSwapParamsAction } from 'src/store/swap/swap-actions';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { SwapForm } from './swap-form/swap-form';

export const SwapScreen = memo(() => {
  const dispatch = useDispatch();

  usePageAnalytic(ScreensEnum.SwapScreen);

  const { params } = useRoute<RouteProp<ScreensParamList, ScreensEnum.SwapScreen>>();

  useEffect(() => void dispatch(resetSwapParamsAction()));

  return <SwapForm inputToken={params?.inputToken} outputToken={params?.outputToken} />;
});
