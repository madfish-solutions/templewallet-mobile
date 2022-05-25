import { Formik } from 'formik';
import React, { FC, useMemo } from 'react';

import { emptyFn } from '../../config/general';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useTezosTokenSelector } from '../../store/wallet/wallet-selectors';
import { emptyTezosLikeToken } from '../../token/interfaces/token.interface';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { SwapForm } from './swap-form/swap-form';
import { swapFormValidationSchema } from './swap-form/swap-form.form';

export const SwapScreen: FC = () => {
  const tezosToken = useTezosTokenSelector();

  usePageAnalytic(ScreensEnum.SwapScreen);

  const sendModalInitialValues = useMemo(
    () => ({
      inputAssets: {
        asset: tezosToken,
        amount: undefined
      },
      outputAssets: {
        asset: emptyTezosLikeToken,
        amount: undefined
      },
      bestTrade: [],
      bestTradeWithSlippageTolerance: []
    }),
    []
  );

  return (
    <Formik initialValues={sendModalInitialValues} validationSchema={swapFormValidationSchema} onSubmit={emptyFn}>
      <SwapForm />
    </Formik>
  );
};
