import React, { FC, useCallback, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';

import { ExchangeDataStatusEnum } from '../../../interfaces/exolix.interface';
import { loadExolixExchangeDataActions, setExolixStepAction } from '../../../store/exolix/exolix-actions';
import { useExolixExchangeData, useExolixStep } from '../../../store/exolix/exolix-selectors';
import { isDefined } from '../../../utils/is-defined';
import { ErrorComponent } from './error-component';
import useTopUpUpdate from './use-topup-update.hook';

interface ApproveStepProps {
  isError: boolean;
  setIsError: (b: boolean) => void;
}

export const ApproveStep: FC<ApproveStepProps> = ({ isError, setIsError }) => {
  const step = useExolixStep();
  const exchangeData = useExolixExchangeData();
  const dispatch = useDispatch();
  // TODO: swap-form copy formik

  useTopUpUpdate(setIsError);

  useEffect(() => {
    if (isDefined(exchangeData)) {
      if (exchangeData.status === ExchangeDataStatusEnum.CONFIRMATION) {
        dispatch(setExolixStepAction(2));
      }
      if (exchangeData.status === ExchangeDataStatusEnum.EXCHANGING) {
        dispatch(setExolixStepAction(3));
      }
      if (exchangeData.status === ExchangeDataStatusEnum.OVERDUE) {
        setIsError(true);
      }
    }
  }, [exchangeData, dispatch, setIsError]);

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
      {!isError ? (
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
