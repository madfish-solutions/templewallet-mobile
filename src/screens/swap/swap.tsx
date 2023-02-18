import { RouteProp, useRoute } from '@react-navigation/native';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { loadRoute3DexesAction, loadRoute3TokensAction } from 'src/store/route3/route3-actions';

import { ScreensEnum, ScreensParamList } from '../../navigator/enums/screens.enum';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { isDefined } from '../../utils/is-defined';
import { SwapForm } from './swap-form/swap-form';

export const SwapScreen: FC = () => {
  usePageAnalytic(ScreensEnum.SwapScreen);
  const dispath = useDispatch();
  const { params } = useRoute<RouteProp<ScreensParamList, ScreensEnum.SwapScreen>>();

  useEffect(() => {
    dispath(loadRoute3TokensAction.submit());
    dispath(loadRoute3DexesAction.submit());
  }, []);

  return (
    <SwapForm
      inputToken={isDefined(params) ? params.inputToken : undefined}
      outputToken={isDefined(params) ? params.outputToken : undefined}
    />
  );
};
