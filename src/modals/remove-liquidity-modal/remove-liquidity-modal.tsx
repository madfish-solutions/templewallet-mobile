import { Formik } from 'formik';
import React, { useMemo } from 'react';

import { ModalStatusBar } from '../../components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { useAssetsListSelector, useTezosTokenSelector } from '../../store/wallet/wallet-selectors';
import { RemoveLiquidityFormContent } from './remove-liquidity-form-content/remove-liquidity-form-content';
import { RemoveLiquidityModalFormValues, removeLiquidityModalValidationSchema } from './remove-liquidity-modal.form';

export const RemoveLiquidityModal = () => {
  const assetsList = useAssetsListSelector();
  const tokenA = useTezosTokenSelector();

  const lpList = assetsList.filter(token => token.address === 'KT1AafHA1C1vk959wvHWBispY9Y2f3fxBUUo');
  const tokenB = assetsList.filter(token => token.name === 'tzBTC')[0];

  const onSubmitHandler = () => {
    console.log('submit');
  };

  const removeLiquidityModalInitialValues = useMemo<RemoveLiquidityModalFormValues>(
    () => ({
      lpToken: {
        asset: lpList[0],
        amount: undefined
      },
      aToken: {
        asset: tokenA,
        amount: undefined
      },
      bToken: {
        asset: tokenB,
        amount: undefined
      }
    }),
    [lpList, tokenA, tokenB]
  );

  return (
    <ScreenContainer>
      <ModalStatusBar />
      <Formik
        initialValues={removeLiquidityModalInitialValues}
        enableReinitialize={true}
        validationSchema={removeLiquidityModalValidationSchema}
        onSubmit={onSubmitHandler}
      >
        {RemoveLiquidityFormContent}
      </Formik>
    </ScreenContainer>
  );
};
