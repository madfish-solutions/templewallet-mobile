import { RouteProp, useRoute } from '@react-navigation/core';
import { BigNumber } from 'bignumber.js';
import { FormikProvider, useFormik } from 'formik';
import React, { FC, useCallback, useState } from 'react';
import { Text, View } from 'react-native';

import { ButtonLargePrimary } from '../../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from '../../../../components/button/buttons-floating-container/buttons-floating-container';
import { Divider } from '../../../../components/divider/divider';
import { ScreenContainer } from '../../../../components/screen-container/screen-container';
import { BlackTextLink } from '../../../../components/text-link/black-text-link';
import { ScreensEnum, ScreensParamList } from '../../../../navigator/enums/screens.enum';
import { useSelectedAccountSelector } from '../../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../../styles/format-size';
import { AnalyticsEventCategory } from '../../../../utils/analytics/analytics-event.enum';
import { useAnalytics, usePageAnalytic } from '../../../../utils/analytics/use-analytics.hook';
import { isDefined } from '../../../../utils/is-defined';
import { openUrl } from '../../../../utils/linking.util';
import { convertFiatAmountToXtz, createOrder } from '../../../../utils/utorg.utils';
import { TopUpAssetAmountInterface } from '../../components/top-up-asset-amount-input/top-up-asset-amount-input.props';
import { TopUpFormAssetAmountInput } from '../../components/top-up-form-asset-amount-input/top-up-form-asset-amount-input';
import { outputTokensList } from '../../crypto/exolix/config';
import { useDebitStyles } from '../debit.styles';
import { UTORG_PRIVICY_LINK, UTORG_TERMS_LINK } from './config';
import { useExchangeRate } from './hooks/use-exchange-rate';
import { useFilteredCurrencies } from './hooks/use-filtered-currencies-list.hook';
import { UtorgFormValidationSchema, UtorgFormValues } from './utorg.form';
import { useUtorgStyles } from './utorg.styles';

const UTORG_USD_ICON_URL = 'https://utorg.pro/img/flags2/icon-US.svg';

const DEFAULT_CURRENCY = {
  code: 'USD',
  icon: UTORG_USD_ICON_URL,
  name: '',
  network: '',
  networkFullName: ''
};

export const Utorg: FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { trackEvent } = useAnalytics();
  const { publicKeyHash } = useSelectedAccountSelector();
  const { min, max, currencies } = useRoute<RouteProp<ScreensParamList, ScreensEnum.Utorg>>().params;

  const debitStyles = useDebitStyles();
  const styles = useUtorgStyles();

  usePageAnalytic(ScreensEnum.Utorg);

  const handleSubmit = useCallback(
    ({ sendInput, getOutput }: UtorgFormValues) => {
      if (isDefined(getOutput.amount)) {
        setIsLoading(true);
        trackEvent('UTORG_FORM_SUBMIT', AnalyticsEventCategory.FormSubmit, {
          amount: getOutput.amount.toString()
        });

        createOrder(getOutput.amount.toNumber(), sendInput.asset.code, publicKeyHash)
          .then(url => openUrl(url))
          .finally(() => setIsLoading(false));
      }
    },
    [publicKeyHash]
  );

  const formik = useFormik<UtorgFormValues>({
    initialValues: {
      sendInput: {
        asset: DEFAULT_CURRENCY,
        amount: undefined
      },
      getOutput: {
        asset: outputTokensList[0],
        amount: undefined,
        min,
        max
      }
    },
    validationSchema: UtorgFormValidationSchema,
    onSubmit: handleSubmit
  });

  const { values, submitForm, setFieldValue } = formik;
  const exchangeRate = useExchangeRate(values.sendInput.asset.code, values.sendInput.amount);
  const { filteredCurrencies, setSearchValue } = useFilteredCurrencies(currencies);

  const handleInputValueChange = (inputCurrency: TopUpAssetAmountInterface) => {
    convertFiatAmountToXtz(
      isDefined(inputCurrency.amount) ? inputCurrency.amount.toNumber() : 0,
      inputCurrency.asset.code
    ).then(
      outputAmount =>
        void setFieldValue(
          'getOutput.amount',
          isDefined(inputCurrency.amount) ? new BigNumber(outputAmount) : undefined
        )
    );
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
              setSearchValue={setSearchValue}
            />
            <Divider />
            <TopUpFormAssetAmountInput
              name="getOutput"
              label="Get"
              editable={false}
              assetsList={[outputTokensList[0]]}
              singleAsset
            />
          </FormikProvider>
          <Divider size={formatSize(48)} />
          <View style={styles.exchangeContainer}>
            <Text style={styles.exchangeRate}>Exchange Rate</Text>
            <Text style={styles.exchangeRateValue}>
              1 {values.sendInput.asset.code} ≈ {exchangeRate} XTZ
            </Text>
          </View>
        </View>
        <View>
          <View>
            <Text style={debitStyles.termsOfUse}>By clicking Top UP you agree with</Text>
            <View style={debitStyles.row}>
              <BlackTextLink url={UTORG_TERMS_LINK}>Terms of Use</BlackTextLink>
              <Divider size={formatSize(4)} />
              <Text style={debitStyles.termsOfUse}>and</Text>
              <Divider size={formatSize(4)} />
              <BlackTextLink url={UTORG_PRIVICY_LINK}>Privacy Policy</BlackTextLink>
            </View>
          </View>
          <Divider size={formatSize(16)} />
          <Text style={debitStyles.thirdParty}>
            The exchange feature is provided by a third party. The Temple wallet is not responsible for the work of
            third-party services.
          </Text>
          <Divider size={formatSize(16)} />
        </View>
      </ScreenContainer>
      <ButtonsFloatingContainer>
        <ButtonLargePrimary title={isLoading ? 'Loading...' : 'Top Up'} disabled={isLoading} onPress={submitForm} />
      </ButtonsFloatingContainer>
    </>
  );
};
