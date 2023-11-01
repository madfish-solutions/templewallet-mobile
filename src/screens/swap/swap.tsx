import { RouteProp, useRoute } from '@react-navigation/native';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { loadSwapDexesAction, loadSwapTokensAction, resetSwapParamsAction } from 'src/store/swap/swap-actions';

import { ScreensEnum, ScreensParamList } from '../../navigator/enums/screens.enum';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { isDefined } from '../../utils/is-defined';

import { SwapForm } from './swap-form/swap-form';

export const SwapScreen: FC = () => {
  const dispatch = useDispatch();

  usePageAnalytic(ScreensEnum.SwapScreen);

  const { params } = useRoute<RouteProp<ScreensParamList, ScreensEnum.SwapScreen>>();

  useEffect(() => {
    dispatch(resetSwapParamsAction());
    dispatch(loadSwapTokensAction.submit());
    dispatch(loadSwapDexesAction.submit());
  });

  return (
    <SwapForm
      inputToken={isDefined(params) ? params.inputToken : undefined}
      outputToken={isDefined(params) ? params.outputToken : undefined}
    />
  );
};
