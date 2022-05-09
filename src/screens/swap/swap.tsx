import { Formik } from 'formik';
import React, { FC, useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useAllRoutePairs } from 'swap-router-sdk';

import { SwapPriceUpdateBar } from '../../components/swap-price-update-bar/swap-price-update-bar';
import { emptyFn } from '../../config/general';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useTezosTokenSelector } from '../../store/wallet/wallet-selectors';
import { emptyToken } from '../../token/interfaces/token.interface';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { TEZOS_DEXES_API_URL } from './config';
import { SwapForm } from './swap-form/swap-form';
import { swapFormValidationSchema } from './swap-form/swap-form.form';

export const SwapScreen: FC = () => {
  const tezosToken = useTezosTokenSelector();
  usePageAnalytic(ScreensEnum.SwapScreen);

  const allRoutePairs = useAllRoutePairs(TEZOS_DEXES_API_URL);

  const sendModalInitialValues = useMemo(
    () => ({
      inputAssets: {
        asset: tezosToken,
        amount: undefined
      },
      outputAssets: {
        asset: emptyToken,
        amount: undefined
      },
      bestTrade: [],
      bestTradeWithSlippageTolerance: []
    }),
    []
  );

  return (
    <ScrollView>
      <SwapPriceUpdateBar blockTimestamp={allRoutePairs.block.header.timestamp.toString()} />
      <Formik initialValues={sendModalInitialValues} validationSchema={swapFormValidationSchema} onSubmit={emptyFn}>
        <SwapForm loadingHasFailed={allRoutePairs.hasFailed} />
      </Formik>
    </ScrollView>
  );
};
