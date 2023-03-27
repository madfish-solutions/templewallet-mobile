import { BigNumber } from 'bignumber.js';
import { FormikProvider, useFormik } from 'formik';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
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
import { TopUpInputTypeEnum } from 'src/enums/top-up-input-type.enum';
// import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { PaymentProviderInterface, TopUpInputInterface } from 'src/interfaces/topup.interface';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import {
  loadAliceBobCurrenciesActions,
  loadLocationActions,
  loadMoonPayCryptoCurrenciesActions,
  loadMoonPayFiatCurrenciesActions,
  loadUtorgCurrenciesActions
} from 'src/store/buy-with-credit-card/buy-with-credit-card-actions';
// import { useProviderCurrenciesErrorSelector } from 'src/store/buy-with-credit-card/buy-with-credit-card-selectors';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics, usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { makeFiatPurchaseProvidersSortPredicate } from 'src/utils/fiat-purchase-providers.utils';
import { isDefined } from 'src/utils/is-defined';

import { renderPaymentProviderOption } from '../components/payment-provider/payment-provider';
import { SelectedPaymentProvider } from '../components/selected-payment-provider/selected-payment-provider';
import { TopUpAssetAmountInterface } from '../components/top-up-asset-amount-input/top-up-asset-amount-input.props';
import { TopUpFormAssetAmountInput } from '../components/top-up-form-asset-amount-input/top-up-form-asset-amount-input';
import { outputTokensList as exolixOutputTokensList } from '../crypto/exolix/config';
import { BuyWithCreditCardFormValues, BuyWithCreditCardValidationSchema } from './buy-with-credit-card.form';
import { useBuyWithCreditCardStyles } from './buy-with-credit-card.styles';
import { useFilteredCryptoCurrencies } from './hooks/use-filtered-crypto-currencies.hook';
import { useFilteredFiatCurrencies } from './hooks/use-filtered-fiat-currencies-list.hook';
import { usePaymentOptions } from './hooks/use-payment-options';

const DEFAULT_CURRENCY = {
  code: 'USD',
  icon: 'https://static.moonpay.com/widget/currencies/usd.svg',
  name: 'US Dollar',
  network: '',
  networkFullName: '',
  type: TopUpInputTypeEnum.Fiat
};

const newValueInputAssetChangedFn = (newAsset: TopUpInputInterface, amount: BigNumber | undefined) => ({
  asset: newAsset,
  amount,
  min: newAsset.minAmount,
  max: newAsset.maxAmount
});

// TODO: add selectors and analytics
export const BuyWithCreditCard: FC = () => {
  const dispatch = useDispatch();
  const colors = useColors();
  const styles = useBuyWithCreditCardStyles();
  const [isLoading, setIsLoading] = useState(false);
  /* const error1 = useProviderCurrenciesErrorSelector(TopUpProviderEnum.AliceBob);
  const error2 = useProviderCurrenciesErrorSelector(TopUpProviderEnum.MoonPay);
  const error3 = useProviderCurrenciesErrorSelector(TopUpProviderEnum.Utorg);
  console.log('x1', error1, error2, error3); */

  const { trackEvent } = useAnalytics();
  usePageAnalytic(ScreensEnum.BuyWithCreditCard);

  useEffect(() => {
    dispatch(loadLocationActions.submit());
    dispatch(loadMoonPayFiatCurrenciesActions.submit());
    dispatch(loadMoonPayCryptoCurrenciesActions.submit());
    dispatch(loadUtorgCurrenciesActions.submit());
    dispatch(loadAliceBobCurrenciesActions.submit());
  }, []);

  const {
    allCurrencies: allFiatCurrencies,
    filteredCurrencies: filteredFiatCurrencies,
    setSearchValue: setInputSearchValue
  } = useFilteredFiatCurrencies();
  const { filteredCurrencies: filteredCryptoCurrencies, setSearchValue: setOutputSearchValue } =
    useFilteredCryptoCurrencies();

  const handleSubmit = useCallback((values: BuyWithCreditCardFormValues) => {
    trackEvent('BUY_WITH_CREDIT_CARD_SUBMIT', AnalyticsEventCategory.FormSubmit, {
      inputAmount: values.sendInput.amount?.toString(),
      inputAsset: values.sendInput.asset.code,
      outputAmount: values.getOutput.amount?.toString(),
      outputAsset: values.getOutput.asset.code,
      provider: values.paymentProvider?.name
    });
    console.log('TODO: implement work with various platforms');
  }, []);

  const formik = useFormik<BuyWithCreditCardFormValues>({
    initialValues: {
      sendInput: {
        asset: DEFAULT_CURRENCY,
        amount: undefined
      },
      getOutput: {
        asset: exolixOutputTokensList[0],
        amount: undefined
      }
    },
    validationSchema: BuyWithCreditCardValidationSchema,
    onSubmit: handleSubmit
  });

  const { values, submitForm, setFieldValue, setFieldTouched, isValid, submitCount } = formik;

  const { allPaymentOptions, paymentOptionsToDisplay, updateOutputAmounts } = usePaymentOptions(
    values.sendInput.amount,
    values.sendInput.asset,
    values.getOutput.asset
  );

  useEffect(() => {
    const newInputAsset = allFiatCurrencies.find(({ code }) => code === values.sendInput.asset.code);

    if (isDefined(newInputAsset) && newInputAsset !== values.sendInput.asset) {
      setFieldValue('sendInput', newValueInputAssetChangedFn(newInputAsset, values.sendInput.amount));
    }
  }, [formik, allFiatCurrencies]);

  useEffect(() => {
    const newPaymentOption = allPaymentOptions.find(({ id }) => id === values.paymentProvider?.id);

    if (isDefined(newPaymentOption) && newPaymentOption !== values.paymentProvider) {
      handlePaymentProviderChange(newPaymentOption);
    }
  }, [formik, allPaymentOptions]);

  const exchangeRate = useMemo(() => {
    const inputAmount = values.sendInput.amount;
    const outputAmount = values.getOutput.amount;
    if (isDefined(inputAmount) && inputAmount.gt(0) && isDefined(outputAmount) && outputAmount.gt(0)) {
      return outputAmount.div(inputAmount);
    }

    return undefined;
  }, [values.sendInput.amount, values.getOutput.amount]);

  const handlePaymentProviderChange = async (newProvider?: PaymentProviderInterface) => {
    await setFieldValue('paymentProvider', newProvider);
    const newOutputAmount = newProvider?.outputAmount;
    await setFieldValue('getOutput.amount', isDefined(newOutputAmount) ? new BigNumber(newOutputAmount) : undefined);
  };

  const handleInputValueChange = async (newInput: TopUpAssetAmountInterface) => {
    setIsLoading(true);
    const amounts = await updateOutputAmounts(newInput.amount, newInput.asset);
    const patchedPaymentOptions: PaymentProviderInterface[] = paymentOptionsToDisplay
      .map(({ id, ...rest }) => ({
        ...rest,
        id,
        outputAmount: amounts[id]
      }))
      .sort(makeFiatPurchaseProvidersSortPredicate(newInput.amount));
    const bestPaymentOption = patchedPaymentOptions[0];
    const newOutputAmount = bestPaymentOption?.outputAmount;

    await setFieldValue('getOutput.amount', isDefined(newOutputAmount) ? new BigNumber(newOutputAmount) : undefined);
    await handlePaymentProviderChange(bestPaymentOption);
    setIsLoading(false);
  };

  return (
    <>
      <ScreenContainer isFullScreenMode>
        <View>
          <Divider size={formatSize(16)} />
          <FormikProvider value={formik}>
            <TopUpFormAssetAmountInput
              name="sendInput"
              label="Send"
              isSearchable
              assetsList={filteredFiatCurrencies}
              newValueAssetChangedFn={newValueInputAssetChangedFn}
              onValueChange={handleInputValueChange}
              onBlur={() => setFieldTouched('sendInput')}
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
              isSearchable
              assetsList={filteredCryptoCurrencies}
              onBlur={() => setFieldTouched('getOutput')}
              setSearchValue={setOutputSearchValue}
            />
          </FormikProvider>
          <Divider />
          <Dropdown
            value={values.paymentProvider}
            list={paymentOptionsToDisplay}
            description="Select payment provider"
            itemHeight={formatSize(81)}
            equalityFn={(a, b) => a.name === b?.name}
            itemContainerStyle={styles.paymentProviderItemContainer}
            renderValue={SelectedPaymentProvider}
            renderListItem={renderPaymentProviderOption}
            keyExtractor={x => x.name}
            onValueChange={handlePaymentProviderChange}
          />
          <Divider size={formatSize(16)} />
          <View style={styles.exchangeContainer}>
            <Text style={styles.exchangeRate}>Exchange Rate</Text>
            <Text style={styles.exchangeRateValue}>
              {isDefined(exchangeRate) ? `1 ${values.sendInput.asset.code} ≈ ${exchangeRate} XTZ` : '---'}
            </Text>
          </View>
        </View>
        <Divider size={formatSize(16)} />
        <Disclaimer
          title="Disclaimer"
          texts={['Temple integrated third-party solutions to buy TEZ or USDT with crypto or a Debit/Credit card.']}
        />
      </ScreenContainer>
      <ButtonsFloatingContainer>
        <ButtonLargePrimary
          title={isLoading ? 'Loading...' : 'Top Up'}
          disabled={(submitCount !== 0 && !isValid) || isLoading}
          onPress={submitForm}
        />
      </ButtonsFloatingContainer>
    </>
  );
};
