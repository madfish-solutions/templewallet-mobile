import { BigNumber } from 'bignumber.js';
import { FormikProvider } from 'formik';
import { debounce } from 'lodash-es';
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { Divider } from 'src/components/divider/divider';
import { Dropdown } from 'src/components/dropdown/dropdown';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { useTimerEffect } from 'src/hooks/use-timer-effect.hook';
import { PaymentProviderInterface, TopUpInputInterface } from 'src/interfaces/topup.interface';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { loadAllCurrenciesActions } from 'src/store/buy-with-credit-card/actions';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { getPaymentProvidersToDisplay } from 'src/utils/fiat-purchase-providers.utils';
import { isDefined } from 'src/utils/is-defined';
import { isTruthy } from 'src/utils/is-truthy';
import { jsonEqualityFn } from 'src/utils/store.utils';

import { renderPaymentProviderOption } from '../components/payment-provider';
import { renderSelectedPaymentProvider } from '../components/selected-payment-provider';
import { TopUpAssetAmountInterface } from '../components/top-up-asset-amount-input/types';
import { TopUpFormAssetAmountInput } from '../components/top-up-form-asset-amount-input';
import { useBuyWithCreditCardFormik } from './hooks/use-buy-with-credit-card-formik.hook';
import { useFilteredCryptoCurrencies } from './hooks/use-filtered-crypto-currencies.hook';
import { useFilteredFiatCurrencies } from './hooks/use-filtered-fiat-currencies-list.hook';
import { usePaymentProviders } from './hooks/use-payment-providers.hook';
import { BuyWithCreditCardSelectors } from './selectors';
import { useBuyWithCreditCardStyles } from './styles';

const newTopUpAssetAmountFn = (
  _: TopUpAssetAmountInterface,
  newAsset: TopUpInputInterface,
  amount: BigNumber | undefined
) => ({
  asset: newAsset,
  amount: isDefined(newAsset.precision) ? amount?.decimalPlaces(newAsset.precision) : amount,
  min: newAsset.minAmount,
  max: newAsset.maxAmount
});
const paymentProviderKeyFn = (value: PaymentProviderInterface) => value.id;
const paymentProvidersAreSame = (a: PaymentProviderInterface, b?: PaymentProviderInterface) => a.id === b?.id;

export const BuyWithCreditCard: FC = () => {
  const dispatch = useDispatch();
  const colors = useColors();
  const styles = useBuyWithCreditCardStyles();
  const [isLoading, setIsLoading] = useState(false);

  usePageAnalytic(ScreensEnum.BuyWithCreditCard);

  useEffect(() => void dispatch(loadAllCurrenciesActions.submit()), []);

  const {
    allCurrencies: allFiatCurrencies,
    filteredCurrencies: filteredFiatCurrencies,
    setSearchValue: setInputSearchValue
  } = useFilteredFiatCurrencies();
  const { filteredCurrencies: filteredCryptoCurrencies, setSearchValue: setOutputSearchValue } =
    useFilteredCryptoCurrencies();

  const formik = useBuyWithCreditCardFormik();

  const { errors, touched, values, submitForm, setFieldValue, setFieldTouched, isValid, submitCount } = formik;
  const { asset: inputAsset, amount: inputAmount } = values.sendInput;
  const { asset: outputAsset, amount: outputAmount } = values.getOutput;
  const manuallySelectedProviderIdRef = useRef<TopUpProviderEnum>();

  const { allPaymentProviders, paymentProvidersToDisplay, updateOutputAmounts } = usePaymentProviders(
    inputAmount,
    inputAsset,
    outputAsset
  );
  const isPaymentProviderError =
    isDefined(errors.paymentProvider) &&
    (isTruthy(touched.paymentProvider) || submitCount > 0) &&
    paymentProvidersToDisplay.length > 0;

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

  useEffect(() => {
    const { asset: currentInputAsset, amount: currentInputAmount } = values.sendInput;
    const newInputAsset = allFiatCurrencies.find(({ code }) => code === currentInputAsset.code);

    if (isDefined(newInputAsset) && !jsonEqualityFn(newInputAsset, currentInputAsset)) {
      setFieldValue('sendInput', newTopUpAssetAmountFn(values.sendInput, newInputAsset, currentInputAmount));
    }
  }, [values.sendInput, allFiatCurrencies, setFieldValue]);

  useEffect(() => {
    const currentPaymentProvider = values.paymentProvider;
    const newPaymentProvider = paymentProvidersToDisplay.find(({ id }) => id === currentPaymentProvider?.id);

    if (isDefined(newPaymentProvider) && !jsonEqualityFn(newPaymentProvider, currentPaymentProvider)) {
      switchPaymentProvider(newPaymentProvider);
    }
  }, [values.paymentProvider, paymentProvidersToDisplay, switchPaymentProvider]);

  const exchangeRate = useMemo(() => {
    if (isDefined(inputAmount) && inputAmount.gt(0) && isDefined(outputAmount) && outputAmount.gt(0)) {
      return outputAmount.div(inputAmount).decimalPlaces(6);
    }

    return undefined;
  }, [inputAmount, outputAmount]);

  const inputValueRef = useRef(values.sendInput);
  const updateOutput = useMemo(
    () =>
      debounce(async (newInput: TopUpAssetAmountInterface, shouldSwitchBetweenProviders: boolean) => {
        inputValueRef.current = newInput;
        const amounts = await updateOutputAmounts(newInput.amount, newInput.asset);

        if (inputValueRef.current !== newInput) {
          return;
        }

        const patchedPaymentProviders = getPaymentProvidersToDisplay(
          allPaymentProviders.map(({ id, ...rest }) => ({
            ...rest,
            id,
            outputAmount: amounts[id]
          })),
          {},
          {},
          newInput.amount
        );
        const autoselectedPaymentProvider = patchedPaymentProviders[0];

        if (shouldSwitchBetweenProviders && !isDefined(manuallySelectedProviderIdRef.current)) {
          void switchPaymentProvider(autoselectedPaymentProvider);
        } else if (isDefined(newInput.amount)) {
          const patchedSameProvider = patchedPaymentProviders.find(({ id }) => id === values.paymentProvider?.id);
          const newPaymentProvider = patchedSameProvider ?? autoselectedPaymentProvider;
          void switchPaymentProvider(newPaymentProvider);
        }
        setIsLoading(false);
      }, 200),
    [values.paymentProvider, updateOutputAmounts, allPaymentProviders, switchPaymentProvider]
  );

  const handleInputValueChange = useCallback(
    (newInput: TopUpAssetAmountInterface) => {
      inputValueRef.current = newInput;
      setIsLoading(true);
      void updateOutput(newInput, true);
    },
    [updateOutput]
  );

  const handlePaymentProviderChange = useCallback(
    (newProvider?: PaymentProviderInterface) => {
      manuallySelectedProviderIdRef.current = newProvider?.id;
      void switchPaymentProvider(newProvider);
    },
    [switchPaymentProvider]
  );

  const handleSendInputBlur = useCallback(() => void setFieldTouched('sendInput'), [setFieldTouched]);
  const handleGetOutputBlur = useCallback(() => void setFieldTouched('getOutput'), [setFieldTouched]);

  useTimerEffect(
    () => {
      dispatch(loadAllCurrenciesActions.submit());
      if (!isLoading) {
        setIsLoading(true);
        void updateOutput(values.sendInput, false);
      }
    },
    10000,
    [updateOutput, dispatch, values.sendInput, isLoading],
    false
  );

  return (
    <>
      <ScreenContainer isFullScreenMode>
        <View>
          <Divider size={formatSize(16)} />
          <FormikProvider value={formik}>
            <TopUpFormAssetAmountInput
              name="sendInput"
              label="Send"
              description="Select a fiat currency"
              emptyListText="Not found fiat currency"
              isSearchable
              assetsList={filteredFiatCurrencies}
              newValueFn={newTopUpAssetAmountFn}
              precision={inputAsset.precision}
              testID={BuyWithCreditCardSelectors.sendInput}
              onValueChange={handleInputValueChange}
              onBlur={handleSendInputBlur}
              setSearchValue={setInputSearchValue}
            />
            <Divider size={formatSize(8)} />
            <View style={styles.arrowContainer}>
              <Icon size={formatSize(24)} name={IconNameEnum.ArrowDown} color={colors.peach} />
            </View>
            <Divider size={formatSize(12)} />
            <TopUpFormAssetAmountInput
              name="getOutput"
              label="Get"
              description="Select a crypto currency"
              emptyListText="Not found crypto currency"
              editable={false}
              isSearchable
              assetsList={filteredCryptoCurrencies}
              testID={BuyWithCreditCardSelectors.getOutput}
              onBlur={handleGetOutputBlur}
              setSearchValue={setOutputSearchValue}
            />
          </FormikProvider>
          <Divider size={formatSize(16)} />
          <View style={styles.paymentProviderDropdownContainer}>
            <Dropdown
              value={values.paymentProvider}
              list={paymentProvidersToDisplay}
              description="Select payment provider"
              emptyListText="No providers found"
              itemHeight={formatSize(81)}
              equalityFn={paymentProvidersAreSame}
              itemContainerStyle={styles.paymentProviderItemContainer}
              renderValue={renderSelectedPaymentProvider}
              renderListItem={renderPaymentProviderOption}
              keyExtractor={paymentProviderKeyFn}
              testID={BuyWithCreditCardSelectors.provider}
              onValueChange={handlePaymentProviderChange}
            />
          </View>
          {isPaymentProviderError && <Text style={styles.errorText}>Please select payment provider</Text>}
          <Divider size={formatSize(16)} />
          <View style={styles.exchangeContainer}>
            <Text style={styles.exchangeRate}>Exchange Rate</Text>
            <Text style={styles.exchangeRateValue}>
              {isDefined(exchangeRate) && isDefined(inputAsset.code) && !isLoading
                ? `1 ${inputAsset.code} = ${exchangeRate} ${outputAsset.code}`
                : '---'}
            </Text>
          </View>
          <Divider size={formatSize(18)} />
          <Disclaimer
            title="Disclaimer"
            texts={['Temple integrated third-party solutions to buy TEZ or USDT with crypto or a Debit/Credit card.']}
          />
        </View>
      </ScreenContainer>
      <ButtonsFloatingContainer>
        <ButtonLargePrimary
          title={isLoading ? 'Loading...' : 'Top Up'}
          disabled={(submitCount !== 0 && !isValid) || isLoading}
          testID={BuyWithCreditCardSelectors.submitButton}
          onPress={submitForm}
        />
      </ButtonsFloatingContainer>
    </>
  );
};
