import { RouteProp, useRoute } from '@react-navigation/core';
import { BigNumber } from 'bignumber.js';
import { FormikProvider, useFormik } from 'formik';
import React, { FC } from 'react';

import { ScreenContainer } from '../../../../components/screen-container/screen-container';
import { ScreensEnum, ScreensParamList } from '../../../../navigator/enums/screens.enum';
import { TopUpFormAssetAmountInput } from '../../components/top-up-form-asset-amount-input/top-up-form-asset-amount-input';
import { exolixTopupFormValidationSchema, ExolixTopupFormValues } from '../../crypto/exolix/exolix-topup.form';

export const AliceBob: FC = () => {
  const { min, max } = useRoute<RouteProp<ScreensParamList, ScreensEnum.AliceBob>>().params;

  const handleSubmit = () => {
    console.log('suka');
  };

  const formik = useFormik<ExolixTopupFormValues>({
    initialValues: {
      coinFrom: {
        asset: {
          code: 'UAH',
          name: 'Hryvnia',
          icon: require('./assets/uah.png')
        },
        amount: new BigNumber(0),
        min,
        max
      }
    },
    validationSchema: exolixTopupFormValidationSchema,
    onSubmit: handleSubmit
  });

  return (
    <ScreenContainer isFullScreenMode>
      <FormikProvider value={formik}>
        <TopUpFormAssetAmountInput name="coinFrom" label="Enter total amount" />
      </FormikProvider>
    </ScreenContainer>
  );
};
