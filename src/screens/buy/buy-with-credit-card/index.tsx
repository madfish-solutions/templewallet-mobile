import { BigNumber } from 'bignumber.js';
import { FormikProvider } from 'formik';
import React, { FC, useEffect, useMemo, useState } from 'react';
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
import { useInterval } from 'src/hooks/use-interval.hook';
import { PaymentProviderInterface, TopUpInputInterface } from 'src/interfaces/topup.interface';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { loadAllCurrenciesActions } from 'src/store/buy-with-credit-card/actions';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';
import { isTruthy } from 'src/utils/is-truthy';
import { jsonEqualityFn } from 'src/utils/store.utils';

import { renderPaymentProviderOption } from '../components/payment-provider';
import { renderSelectedPaymentProvider } from '../components/selected-payment-provider';
import { TopUpAssetAmountInterface } from '../components/top-up-asset-amount-input/types';
import { TopUpFormAssetAmountInput } from '../components/top-up-form-asset-amount-input';
import { useBuyWithCreditCardFormik } from './hooks/use-buy-with-credit-card-formik.hook';
import { useFiatCurrenciesList } from './hooks/use-fiat-currencies-list.hook';
import { useFilteredCryptoCurrencies } from './hooks/use-filtered-crypto-currencies.hook';
import { useFormInputsCallbacks } from './hooks/use-form-inputs-callbacks';
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

  const formik = useBuyWithCreditCardFormik();
  const { errors, touched, values, submitForm, setFieldValue, isValid, submitCount } = formik;
  const { asset: inputAsset, amount: inputAmount } = values.sendInput;
  const { asset: outputAsset, amount: outputAmount } = values.getOutput;
  const {
    currenciesWithPairLimits,
    filteredCurrencies: filteredFiatCurrencies,
    setSearchValue: setInputSearchValue
  } = useFiatCurrenciesList(inputAsset.code, outputAsset.code);
  const { filteredCurrencies: filteredCryptoCurrencies, setSearchValue: setOutputSearchValue } =
    useFilteredCryptoCurrencies();

  const paymentProviders = usePaymentProviders(inputAmount, inputAsset, outputAsset);
  const { paymentProvidersToDisplay } = paymentProviders;
  const {
    switchPaymentProvider,
    handleInputValueChange,
    handleOutputValueChange,
    handlePaymentProviderChange,
    handleSendInputBlur,
    handleGetOutputBlur,
    refreshForm
  } = useFormInputsCallbacks(formik, paymentProviders, isLoading, setIsLoading);
  const isPaymentProviderError =
    isDefined(errors.paymentProvider) &&
    (isTruthy(touched.paymentProvider) || submitCount > 0) &&
    paymentProvidersToDisplay.length > 0;

  useEffect(() => {
    const { asset: currentInputAsset, amount: currentInputAmount } = values.sendInput;
    const newInputAsset = currenciesWithPairLimits.find(({ code }) => code === currentInputAsset.code);

    if (isDefined(newInputAsset) && !jsonEqualityFn(newInputAsset, currentInputAsset)) {
      setFieldValue('sendInput', newTopUpAssetAmountFn(values.sendInput, newInputAsset, currentInputAmount));
    }
  }, [values.sendInput, currenciesWithPairLimits, setFieldValue]);

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

  useInterval(refreshForm, 10000, [refreshForm], false);

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
              tokenTestID={BuyWithCreditCardSelectors.fiatCurrencyItem}
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
              onValueChange={handleOutputValueChange}
              assetsList={filteredCryptoCurrencies}
              testID={BuyWithCreditCardSelectors.getOutput}
              tokenTestID={BuyWithCreditCardSelectors.cryptoCurrencyItem}
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
                ? `1 ${inputAsset.code} = ${exchangeRate} ${outputAsset.codeToDisplay ?? outputAsset.code}`
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
