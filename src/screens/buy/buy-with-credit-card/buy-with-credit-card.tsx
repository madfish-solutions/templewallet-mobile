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
import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { PaymentProviderInterface, TopUpInputInterface } from 'src/interfaces/topup.interface';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import {
  loadAliceBobCurrenciesActions,
  loadMoonPayCryptoCurrenciesActions,
  loadMoonPayFiatCurrenciesActions,
  loadUtorgCurrenciesActions
} from 'src/store/buy-with-credit-card/buy-with-credit-card-actions';
import { useUserIdSelector } from 'src/store/settings/settings-selectors';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { showErrorToast } from 'src/toast/toast.utils';
import { createOrder as createAliceBobOrder } from 'src/utils/alice-bob.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics, usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { fiatPurchaseProvidersSortPredicate } from 'src/utils/fiat-purchase-providers.utils';
import { getAxiosQueryErrorMessage } from 'src/utils/get-axios-query-error-message';
import { isDefined } from 'src/utils/is-defined';
import { openUrl } from 'src/utils/linking.util';
import { getSignedMoonPayUrl } from 'src/utils/moonpay.utils';
import { createOrder as createUtorgOrder } from 'src/utils/utorg.utils';

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
  const { publicKeyHash } = useSelectedAccountSelector();
  const userId = useUserIdSelector();
  const [isLoading, setIsLoading] = useState(false);

  const { trackEvent } = useAnalytics();
  usePageAnalytic(ScreensEnum.BuyWithCreditCard);

  useEffect(() => {
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

  const handleSubmit = useCallback(
    async (values: BuyWithCreditCardFormValues) => {
      try {
        trackEvent('BUY_WITH_CREDIT_CARD_SUBMIT', AnalyticsEventCategory.FormSubmit, {
          inputAmount: values.sendInput.amount?.toString(),
          inputAsset: values.sendInput.asset.code,
          outputAmount: values.getOutput.amount?.toString(),
          outputAsset: values.getOutput.asset.code,
          provider: values.paymentProvider?.name
        });

        const inputAmount = values.sendInput.amount;
        const outputAmount = values.getOutput.amount;

        if (!isDefined(inputAmount) || !isDefined(outputAmount)) {
          return;
        }

        let urlToOpen: string;
        switch (values.paymentProvider?.id) {
          case TopUpProviderEnum.MoonPay:
            urlToOpen = await getSignedMoonPayUrl(
              values.getOutput.asset.code,
              '#ed8936',
              publicKeyHash,
              inputAmount.toNumber(),
              values.sendInput.asset.code
            );
            break;
          case TopUpProviderEnum.Utorg:
            urlToOpen = await createUtorgOrder(outputAmount.toNumber(), values.sendInput.asset.code, publicKeyHash);
            break;
          default:
            const { payUrl } = await createAliceBobOrder(false, inputAmount.toFixed(), userId, publicKeyHash);
            urlToOpen = payUrl;
        }
        openUrl(urlToOpen);
      } catch (error) {
        showErrorToast({ description: getAxiosQueryErrorMessage(error) });
      }
    },
    [trackEvent]
  );

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
  const { asset: inputAsset } = values.sendInput;
  const { asset: outputAsset } = values.getOutput;

  const { allPaymentOptions, paymentOptionsToDisplay, updateOutputAmounts } = usePaymentOptions(
    values.sendInput.amount,
    inputAsset,
    outputAsset
  );

  const handlePaymentProviderChange = useCallback(
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
    const { asset: currentInputAsset, amount: currentInputAmount } = formik.values.sendInput;
    const newInputAsset = allFiatCurrencies.find(({ code }) => code === currentInputAsset.code);

    if (isDefined(newInputAsset) && newInputAsset !== currentInputAsset) {
      setFieldValue('sendInput', newValueInputAssetChangedFn(newInputAsset, currentInputAmount));
    }
  }, [formik, allFiatCurrencies]);

  useEffect(() => {
    const newPaymentOption = allPaymentOptions.find(({ id }) => id === values.paymentProvider?.id);

    if (isDefined(newPaymentOption) && newPaymentOption !== values.paymentProvider) {
      handlePaymentProviderChange(newPaymentOption);
    }
  }, [formik, allPaymentOptions, handlePaymentProviderChange]);

  const exchangeRate = useMemo(() => {
    const inputAmount = values.sendInput.amount;
    const outputAmount = values.getOutput.amount;
    if (isDefined(inputAmount) && inputAmount.gt(0) && isDefined(outputAmount) && outputAmount.gt(0)) {
      return outputAmount.div(inputAmount).decimalPlaces(6);
    }

    return undefined;
  }, [values.sendInput.amount, values.getOutput.amount]);

  const handleInputValueChange = async (newInput: TopUpAssetAmountInterface) => {
    setIsLoading(true);
    const amounts = await updateOutputAmounts(newInput.amount, newInput.asset);
    const patchedPaymentOptions: PaymentProviderInterface[] = paymentOptionsToDisplay
      .map(({ id, ...rest }) => ({
        ...rest,
        id,
        outputAmount: amounts[id]
      }))
      .sort(fiatPurchaseProvidersSortPredicate);
    const bestPaymentOption = patchedPaymentOptions[0];

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
              {isDefined(exchangeRate) && isDefined(inputAsset.code)
                ? `1 ${inputAsset.code} ≈ ${exchangeRate} ${outputAsset.code}`
                : '---'}
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
