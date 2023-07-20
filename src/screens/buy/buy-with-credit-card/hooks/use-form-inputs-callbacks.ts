import { BigNumber } from 'bignumber.js';
import { debounce } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';

import type { TopUpAssetAmountInterface } from 'src/components/top-up-field';
import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { PaymentProviderInterface } from 'src/interfaces/payment-provider';
import { loadAllCurrenciesActions, updatePairLimitsActions } from 'src/store/buy-with-credit-card/actions';
import { useAllPairsLimitsSelector } from 'src/store/buy-with-credit-card/selectors';
import { TopUpInputInterface } from 'src/store/buy-with-credit-card/types';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';
import { mergeAssetsLimits } from 'src/utils/pair-limits';

import { BuyWithCreditCardSelectors } from '../selectors';
import { useBuyWithCreditCardFormik } from './use-buy-with-credit-card-formik.hook';
import { useFiatCurrenciesList } from './use-fiat-currencies-list.hook';
import { usePaymentProviders } from './use-payment-providers.hook';

export const useFormInputsCallbacks = (
  formik: ReturnType<typeof useBuyWithCreditCardFormik>,
  updateProvidersOutputs: ReturnType<typeof usePaymentProviders>['updateOutputAmounts'],
  isLoading: boolean,
  setFormIsLoading: (newValue: boolean) => void
) => {
  const { trackEvent } = useAnalytics();
  const { values, setFieldTouched, setValues } = formik;
  const { sendInput: inputValue, getOutput: outputValue } = values;
  const { asset: outputToken } = outputValue;
  const outputCalculationDataRef = useRef({ inputValue, outputToken });
  const manuallySelectedProviderIdRef = useRef<TopUpProviderEnum>();
  const valuesRef = useRef(values);
  const isLoadingRef = useRef(isLoading);
  const dispatch = useDispatch();
  const allPairsLimits = useAllPairsLimitsSelector();
  const { noPairLimitsFiatCurrencies } = useFiatCurrenciesList(inputValue.asset.code, outputToken.code);

  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  const setPaymentProvider = useCallback(
    async (newProvider: PaymentProviderInterface | undefined) => {
      const newOutputAmount = newProvider?.outputAmount;
      await setValues(values => ({
        ...values,
        getOutput: {
          ...values.getOutput,
          amount: isDefined(newOutputAmount) ? new BigNumber(newOutputAmount) : undefined
        },
        paymentProvider: newProvider
      }));
    },
    [setValues]
  );

  const updateOutput = useMemo(
    () =>
      debounce(async (newInput: TopUpAssetAmountInterface, newOutputToken: TopUpInputInterface) => {
        const { asset: newInputAsset, amount: newInputAmount } = newInput;

        await updateProvidersOutputs(newInputAmount, newInputAsset, newOutputToken);

        setFormIsLoading(false);
      }, 200),
    [updateProvidersOutputs]
  );

  const handleInputValueChange = useCallback(
    (newInput: TopUpAssetAmountInterface) => {
      const currentOutputToken = valuesRef.current.getOutput.asset;
      outputCalculationDataRef.current = { inputValue: newInput, outputToken: currentOutputToken };
      setFormIsLoading(true);
      updateOutput(newInput, currentOutputToken);
    },
    [updateOutput]
  );

  const handleOutputValueChange = useCallback(
    (newOutput: TopUpAssetAmountInterface) => {
      const { amount: inputAmount, asset: inputCurrency } = valuesRef.current.sendInput;

      const pairLimits = allPairsLimits[inputCurrency.code]?.[newOutput.asset.code];
      const { min: minInputAmount, max: maxInputAmount } = mergeAssetsLimits(
        Object.values(pairLimits ?? {}).map(({ data }) => data)
      );

      const patchedInputCurrency = {
        ...inputCurrency,
        minAmount: minInputAmount,
        maxAmount: maxInputAmount
      };
      const patchedInputValue = { amount: inputAmount, asset: patchedInputCurrency };

      outputCalculationDataRef.current = {
        inputValue: patchedInputValue,
        outputToken: newOutput.asset
      };

      setFormIsLoading(true);
      updateOutput(patchedInputValue, newOutput.asset);
    },
    [noPairLimitsFiatCurrencies, allPairsLimits, updateOutput]
  );

  const handlePaymentProviderChange = useCallback(
    (newProvider?: PaymentProviderInterface) => {
      manuallySelectedProviderIdRef.current = newProvider?.id;
      setPaymentProvider(newProvider);
      if (isDefined(newProvider)) {
        trackEvent(BuyWithCreditCardSelectors.provider, AnalyticsEventCategory.ButtonPress, { newProvider });
      }
    },
    [setPaymentProvider]
  );

  const refreshForm = useCallback(() => {
    const currentInputValue = valuesRef.current.sendInput;
    const { asset: inputCurrency } = currentInputValue;
    const { asset: currentOutputToken } = valuesRef.current.getOutput;

    dispatch(loadAllCurrenciesActions.submit());
    dispatch(updatePairLimitsActions.submit({ fiatSymbol: inputCurrency.code, cryptoSymbol: currentOutputToken.code }));

    if (!isLoadingRef.current) {
      outputCalculationDataRef.current = { inputValue: currentInputValue, outputToken: currentOutputToken };
      setFormIsLoading(true);
      updateOutput(currentInputValue, currentOutputToken);
    }
  }, [dispatch, updateOutput]);

  const handleSendInputBlur = useCallback(() => void setFieldTouched('sendInput'), [setFieldTouched]);
  const handleGetOutputBlur = useCallback(() => void setFieldTouched('getOutput'), [setFieldTouched]);

  return {
    handleInputValueChange,
    handleOutputValueChange,
    handlePaymentProviderChange,
    handleSendInputBlur,
    handleGetOutputBlur,
    refreshForm,
    setPaymentProvider,
    manuallySelectedProviderIdRef
  };
};
