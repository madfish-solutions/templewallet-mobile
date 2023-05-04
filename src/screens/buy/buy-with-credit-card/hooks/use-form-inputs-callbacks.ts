import { BigNumber } from 'bignumber.js';
import { debounce } from 'lodash-es';
import { useCallback, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { PaymentProviderInterface, TopUpInputInterface } from 'src/interfaces/topup.interface';
import { loadAllCurrenciesActions, updatePairLimitsActions } from 'src/store/buy-with-credit-card/actions';
import { useAllPairsLimitsSelector } from 'src/store/buy-with-credit-card/selectors';
import { getPaymentProvidersToDisplay } from 'src/utils/fiat-purchase-providers.utils';
import { intersectAssetsLimits } from 'src/utils/intersect-assets-limits.utils';
import { isDefined } from 'src/utils/is-defined';
import { mergeAssetsLimits } from 'src/utils/merge-assets-limits.utils';
import { jsonEqualityFn } from 'src/utils/store.utils';

import { TopUpAssetAmountInterface } from '../../components/top-up-asset-amount-input/types';
import { useBuyWithCreditCardFormik } from './use-buy-with-credit-card-formik.hook';
import { useFiatCurrenciesList } from './use-fiat-currencies-list.hook';
import { usePaymentProviders } from './use-payment-providers.hook';

export const useFormInputsCallbacks = (
  formik: ReturnType<typeof useBuyWithCreditCardFormik>,
  paymentProviders: ReturnType<typeof usePaymentProviders>,
  isLoading: boolean,
  setIsLoading: (newValue: boolean) => void
) => {
  const { setFieldValue, values, setFieldTouched } = formik;
  const { sendInput: inputValue, getOutput: outputValue, paymentProvider } = values;
  const { asset: outputToken } = outputValue;
  const { allPaymentProviders, updateOutputAmounts } = paymentProviders;
  const outputCalculationDataRef = useRef({ inputValue, outputToken });
  const manuallySelectedProviderIdRef = useRef<TopUpProviderEnum>();
  const dispatch = useDispatch();
  const allPairsLimits = useAllPairsLimitsSelector();
  const { noPairLimitsCurrencies: noPairLimitsFiatCurrencies } = useFiatCurrenciesList(
    inputValue.asset.code,
    outputToken.code
  );

  const switchPaymentProvider = useCallback(
    async (newProvider?: PaymentProviderInterface) => {
      const newOutputAmount = newProvider?.outputAmount;
      await Promise.all([
        setFieldValue('paymentProvider', newProvider),
        setFieldValue('getOutput.amount', isDefined(newOutputAmount) ? new BigNumber(newOutputAmount) : undefined)
      ]);
    },
    [setFieldValue]
  );

  const updateOutput = useMemo(
    () =>
      debounce(
        async (
          newInput: TopUpAssetAmountInterface,
          newOutputToken: TopUpInputInterface,
          shouldSwitchBetweenProviders: boolean
        ) => {
          const { asset: newInputAsset, amount: newInputAmount } = newInput;
          const outputCalculationData = { inputValue: newInput, outputToken: newOutputToken };

          const amounts = await updateOutputAmounts(newInputAmount, newInputAsset, newOutputToken);

          if (!jsonEqualityFn(outputCalculationData, outputCalculationDataRef.current)) {
            return;
          }

          const patchedPaymentProviders = getPaymentProvidersToDisplay(
            allPaymentProviders.map(({ id, ...rest }) => ({
              ...rest,
              id,
              inputSymbol: newInputAsset.codeToDisplay ?? newInputAsset.code,
              inputPrecision: newInputAsset.precision,
              minInputAmount: newInputAsset.minAmount,
              maxInputAmount: newInputAsset.maxAmount,
              outputAmount: amounts[id],
              outputSymbol: newOutputToken.codeToDisplay ?? newOutputToken.code,
              outputPrecision: newOutputToken.precision
            })),
            {},
            {},
            newInputAmount
          );
          const autoselectedPaymentProvider = patchedPaymentProviders[0];

          if (shouldSwitchBetweenProviders && !isDefined(manuallySelectedProviderIdRef.current)) {
            void switchPaymentProvider(autoselectedPaymentProvider);
          } else if (isDefined(newInputAmount)) {
            const patchedSameProvider = patchedPaymentProviders.find(({ id }) => id === paymentProvider?.id);
            const newPaymentProvider = patchedSameProvider ?? autoselectedPaymentProvider;
            void switchPaymentProvider(newPaymentProvider);
          }
          setIsLoading(false);
        },
        200
      ),
    [paymentProvider, updateOutputAmounts, allPaymentProviders, switchPaymentProvider]
  );

  const handleInputValueChange = useCallback(
    (newInput: TopUpAssetAmountInterface) => {
      outputCalculationDataRef.current = { inputValue: newInput, outputToken };
      setIsLoading(true);
      void updateOutput(newInput, outputToken, true);
    },
    [updateOutput, outputToken]
  );
  const handleOutputValueChange = useCallback(
    (newOutput: TopUpAssetAmountInterface) => {
      const { amount: inputAmount, asset: inputCurrency } = inputValue;
      const noPairLimitsInputCurrency = noPairLimitsFiatCurrencies.find(({ code }) => code === inputCurrency.code);
      const { min: minInputAmount, max: maxInputAmount } = intersectAssetsLimits([
        { min: noPairLimitsInputCurrency?.minAmount, max: noPairLimitsInputCurrency?.maxAmount },
        mergeAssetsLimits(
          Object.values(allPairsLimits[inputCurrency.code]?.[newOutput.asset.code] ?? {}).map(({ data }) => data)
        )
      ]);
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
      setIsLoading(true);
      void updateOutput(patchedInputValue, newOutput.asset, true);
    },
    [inputValue, noPairLimitsFiatCurrencies, allPairsLimits, updateOutput]
  );
  const handlePaymentProviderChange = useCallback(
    (newProvider?: PaymentProviderInterface) => {
      manuallySelectedProviderIdRef.current = newProvider?.id;
      void switchPaymentProvider(newProvider);
    },
    [switchPaymentProvider]
  );
  const refreshForm = useCallback(() => {
    const { asset: inputCurrency } = inputValue;
    dispatch(loadAllCurrenciesActions.submit());
    dispatch(updatePairLimitsActions.submit({ fiatSymbol: inputCurrency.code, cryptoSymbol: outputToken.code }));
    if (!isLoading) {
      outputCalculationDataRef.current = { inputValue, outputToken };
      setIsLoading(true);
      void updateOutput(inputValue, outputToken, false);
    }
  }, [dispatch, inputValue, outputToken, updateOutput, isLoading]);

  const handleSendInputBlur = useCallback(() => void setFieldTouched('sendInput'), [setFieldTouched]);
  const handleGetOutputBlur = useCallback(() => void setFieldTouched('getOutput'), [setFieldTouched]);

  return {
    switchPaymentProvider,
    handleInputValueChange,
    handleOutputValueChange,
    handlePaymentProviderChange,
    handleSendInputBlur,
    handleGetOutputBlur,
    refreshForm
  };
};
