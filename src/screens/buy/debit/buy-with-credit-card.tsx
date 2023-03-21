import { FormikProvider, useFormik } from 'formik';
import React, { FC, useCallback, useMemo } from 'react';
import { Text, View } from 'react-native';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { Divider } from 'src/components/divider/divider';
import { Dropdown } from 'src/components/dropdown/dropdown';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { PaymentProviderInterface } from 'src/interfaces/topup.interface';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics, usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';

import { renderPaymentProviderOption } from '../components/payment-provider/payment-provider';
import { SelectedPaymentProvider } from '../components/selected-payment-provider/selected-payment-provider';
import { TopUpAssetAmountInterface } from '../components/top-up-asset-amount-input/top-up-asset-amount-input.props';
import { TopUpFormAssetAmountInput } from '../components/top-up-form-asset-amount-input/top-up-form-asset-amount-input';
import { outputTokensList as exolixOutputTokensList } from '../crypto/exolix/config';
import { BuyWithCreditCardFormValues, BuyWithCreditCardValidationSchema } from './buy-with-credit-card.form';
import { useBuyWithCreditCardStyles } from './buy-with-credit-card.styles';
/* import { useAliceBobPairInfo } from '../hooks/use-alice-bob-pair-info';
import { useSignedMoonPayUrl } from '../hooks/use-signed-moonpay-url';
import { useUtorgExchangeInfo } from '../hooks/use-utorg-exchange-info'; */
import { useFilteredCurrencies } from './hooks/use-filtered-currencies-list.hook';

const UTORG_USD_ICON_URL = 'https://utorg.pro/img/flags2/icon-US.svg';
const DEFAULT_CURRENCY = {
  code: 'USD',
  icon: UTORG_USD_ICON_URL,
  name: '',
  network: '',
  networkFullName: ''
};

const mockCurrenciesSymbols = ['USD', 'EUR', 'UAH'];
const mockPaymentProviders: PaymentProviderInterface[] = [
  {
    name: 'MoonPay',
    iconName: IconNameEnum.MoonPay,
    kycRequired: true,
    isBestPrice: true,
    minInputAmount: 5,
    maxInputAmount: 1000,
    inputAmount: 10,
    inputSymbol: 'USD',
    outputAmount: 8.9,
    outputSymbol: 'TEZ'
  },
  {
    name: 'Utorg',
    iconName: IconNameEnum.Utorg,
    kycRequired: false,
    isBestPrice: true,
    minInputAmount: 5,
    maxInputAmount: 1000,
    inputAmount: 10,
    inputSymbol: 'USD',
    outputAmount: 8.8,
    outputSymbol: 'TEZ'
  },
  {
    name: 'Alice-Bob',
    iconName: IconNameEnum.AliceBob,
    kycRequired: true,
    isBestPrice: false,
    minInputAmount: 5,
    maxInputAmount: 1000,
    inputAmount: 10,
    inputSymbol: 'USD',
    outputAmount: 8.7,
    outputSymbol: 'TEZ'
  }
];

// TODO: add selectors and analytics
export const BuyWithCreditCard: FC = () => {
  const { isTezosNode } = useNetworkInfo();
  const colors = useColors();
  const styles = useBuyWithCreditCardStyles();
  const isLoading = false;

  const { trackEvent } = useAnalytics();
  usePageAnalytic(ScreensEnum.BuyWithCreditCard);

  /* const { signedMoonPayUrl, isMoonPayError, isMoonPayDisabled } = useSignedMoonPayUrl();
  const { availableUtorgCurrencies, minUtorgExchangeAmount, maxUtorgExchangeAmount, isUtorgError, isUtorgDisabled } =
    useUtorgExchangeInfo();
  const { minAliceBobExchangeAmount, maxAliceBobExchangeAmount, isAliceBobError, isAliceBobDisabled } =
    useAliceBobPairInfo(); */

  const { filteredCurrencies, setSearchValue } = useFilteredCurrencies(mockCurrenciesSymbols);

  const outputTokensList = useMemo(() => [exolixOutputTokensList[0]], [isTezosNode]);

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
        asset: outputTokensList[0],
        amount: undefined
      }
    },
    validationSchema: BuyWithCreditCardValidationSchema,
    onSubmit: handleSubmit
  });

  const { values, submitForm, setFieldValue, setFieldTouched, isValid, submitCount } = formik;

  const exchangeRate = useMemo(() => {
    const inputAmount = values.sendInput.amount;
    const outputAmount = values.getOutput.amount;
    if (isDefined(inputAmount) && inputAmount.gt(0) && isDefined(outputAmount) && outputAmount.gt(0)) {
      return inputAmount.div(outputAmount);
    }

    return undefined;
  }, [values.sendInput.amount, values.getOutput.amount]);

  const handleInputValueChange = (newInput: TopUpAssetAmountInterface) => {
    console.log('TODO: calculate output amount properly');
    setFieldValue('getOutput.amount', isDefined(newInput.amount) ? newInput.amount.div(2) : undefined);
  };

  const handlePaymentProviderChange = (newProvider?: PaymentProviderInterface) => {
    console.log('TODO: recalculate output amount');
    setFieldValue('paymentProvider', newProvider);
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
              assetsList={filteredCurrencies}
              onValueChange={handleInputValueChange}
              onBlur={() => setFieldTouched('getOutput')}
              setSearchValue={setSearchValue}
            />
            <View style={styles.limitsView}>
              <View style={styles.singleLimitView}>
                <Text style={styles.limitLabel}>Min:</Text>
                <Text style={styles.limitValue}>
                  {isDefined(values.sendInput.min) ? `${values.sendInput.min} ${values.sendInput.asset.code}` : '---'}
                </Text>
              </View>
              <View style={styles.singleLimitView}>
                <Text style={styles.limitLabel}>Max:</Text>
                <Text style={styles.limitValue}>
                  {isDefined(values.sendInput.max) ? `${values.sendInput.max} ${values.sendInput.asset.code}` : '---'}
                </Text>
              </View>
            </View>
            <Divider size={formatSize(8)} />
            <View style={styles.arrowContainer}>
              <Icon size={formatSize(24)} name={IconNameEnum.ArrowDown} color={colors.peach} />
            </View>
            <Divider size={formatSize(12)} />
            <TopUpFormAssetAmountInput
              name="getOutput"
              label="Get"
              editable={false}
              assetsList={outputTokensList}
              singleAsset
            />
          </FormikProvider>
          <Divider />
          <Dropdown
            value={values.paymentProvider}
            list={mockPaymentProviders}
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
