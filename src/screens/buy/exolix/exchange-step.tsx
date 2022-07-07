import React, { FC, useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';

import { loadExolixExchangeDataActions } from '../../../store/exolix/exolix-actions';
import { useExolixExchangeData, useExolixStep } from '../../../store/exolix/exolix-selectors';
import { ErrorComponent } from './error-component';

interface ExchangeStepProps {
  isError: boolean;
  setIsError: (b: boolean) => void;
}

export const ExchangeStep: FC<ExchangeStepProps> = ({ isError, setIsError }) => {
  const step = useExolixStep();
  const exchangeData = useExolixExchangeData();
  const dispatch = useDispatch();
  // TODO: swap-form copy formik

  const handleUpdateExchangeData = useCallback(() => {
    dispatch(
      loadExolixExchangeDataActions.submit({
        coinFrom: 'BTC',
        coinTo: 'XTZ',
        amount: 0.012,
        withdrawalAddress: 'tz1VvDQcafAxpAcc2hFWDpSmRYqdEmEhrW1h',
        withdrawalExtraId: ''
      })
    );
  }, [dispatch]);

  return (
    <>
      {isError ? (
        <View>
          <Text>
            The token exchange feature is provided by a third party. The Temple wallet is not responsible for the work
            of third-party services.
          </Text>
        </View>
      ) : (
        <ErrorComponent setIsError={setIsError} />
      )}
    </>
  );
};
