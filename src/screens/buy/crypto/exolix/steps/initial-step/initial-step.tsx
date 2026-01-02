import { FormikProvider, useFormik } from 'formik';
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { BlackTextLink } from 'src/components/text-link/black-text-link';
import { TopUpAssetAmountInterface, TopUpFormAssetAmountInput } from 'src/components/top-up-field';
import { loadExolixExchangeDataActions } from 'src/store/exolix/exolix-actions';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { AnalyticsError } from 'src/utils/error-analytics-data.utils';
import { isDefined } from 'src/utils/is-defined';
import { isTruthy } from 'src/utils/is-truthy';
import { getProperNetworkFullName } from 'src/utils/topup';

import { ErrorComponent } from '../../components/error-component';
import { EXOLIX_PRIVICY_LINK, EXOLIX_TERMS_LINK, initialFormValues } from '../../config';
import { exolixTopupFormValidationSchema, ExolixTopupFormValues } from '../../exolix-topup.form';
import { useFilteredCurrenciesList } from '../../hooks/use-filtered-currencies-list.hook';

import { InitialStepSelectors } from './initial-step.selectors';
import { useInitialStepStyles } from './initial-step.styles';
import { loadMinMaxFields, updateOutputInputValue } from './initial-step.utils';

interface InitialStepProps {
  isError: boolean;
  setIsError: (b: boolean) => void;
}

export const InitialStep: FC<InitialStepProps> = ({ isError, setIsError }) => {
  const dispatch = useDispatch();
  const styles = useInitialStepStyles();
  const { trackErrorEvent } = useAnalytics();

  const { inputCurrencies, outputCurrencies, filteredInputCurrenciesList, setSearchValue } =
    useFilteredCurrenciesList();
  const publicKeyHash = useCurrentAccountPkhSelector();

  const handleSubmit = () => {
    if (!isDefined(values.coinFrom.amount)) {
      return;
    }
    dispatch(
      loadExolixExchangeDataActions.submit({
        coinFrom: inputCurrency.code,
        networkFrom: inputCurrency.network.code,
        coinTo: outputCurrency.code,
        networkTo: outputCurrency.network.code,
        amount: values.coinFrom.amount.toNumber(),
        withdrawalAddress: publicKeyHash,
        withdrawalExtraId: ''
      })
    );
  };

  const formik = useFormik<ExolixTopupFormValues>({
    initialValues: initialFormValues,
    validationSchema: exolixTopupFormValidationSchema,
    onSubmit: handleSubmit
  });
  const { values, isValid, submitForm, setFieldValue, submitCount } = formik;

  const inputCurrency = values.coinFrom.asset;
  const outputCurrency = values.coinTo.asset;

  const handleAnalyticsError = useCallback(
    (error: AnalyticsError) => {
      const { error: internalError, additionalProperties, addressesToHide } = error;
      trackErrorEvent('ExolixLoadMinMaxFieldsError', internalError, addressesToHide, additionalProperties);
    },
    [trackErrorEvent]
  );

  useEffect(() => {
    loadMinMaxFields(
      setFieldValue,
      handleAnalyticsError,
      inputCurrency.code,
      inputCurrency.network?.code,
      outputCurrency.code,
      outputCurrency.network?.code
    );
  }, [inputCurrency, outputCurrency, handleAnalyticsError]);

  const handleInputValueChange = (inputCurrency: TopUpAssetAmountInterface) => {
    const inputAssetCode = inputCurrency.asset.code;
    const inputAsset = inputCurrencies.find(item => item.code === inputAssetCode);
    if (!isTruthy(inputAsset)) {
      showErrorToast({ description: 'Selected asset not found' });

      return;
    }

    const requestData = {
      coinFrom: inputAssetCode,
      coinFromNetwork: inputAsset.network.code,
      coinTo: outputCurrency.code,
      coinToNetwork: outputCurrency.network.code,
      amount: isDefined(inputCurrency.amount) ? inputCurrency.amount.toNumber() : 0
    };

    updateOutputInputValue(requestData, setFieldValue).catch(
      error => void trackErrorEvent('ExolixHandleInputValueChangeError', error, [], requestData)
    );
  };

  const handleOutputValueChange = (outputCurrency: TopUpAssetAmountInterface) => {
    const outputAssetCode = outputCurrency.asset.code;
    const outputAsset = outputCurrencies.find(item => item.code === outputAssetCode);
    if (!isTruthy(outputAsset)) {
      showErrorToast({ description: 'Selected asset not found' });

      return;
    }

    const requestData = {
      coinFrom: inputCurrency.code,
      coinFromNetwork: inputCurrency.network.code,
      coinTo: outputAssetCode,
      coinToNetwork: outputAsset.network.code,
      amount: isDefined(values.coinFrom.amount) ? values.coinFrom.amount.toNumber() : 0
    };

    updateOutputInputValue(requestData, setFieldValue).catch(
      error => void trackErrorEvent('ExolixHandleOutputValueChangeError', error, [], requestData)
    );
  };

  const disclaimerMessage = useMemo(
    () => [
      `Please, deposit only ${inputCurrency.name} transfer network ${getProperNetworkFullName(inputCurrency)}. \
Otherwise, you may lose your assets permanently.`
    ],
    [inputCurrency]
  );

  return (
    <>
      {!isError ? (
        <>
          <ScreenContainer isFullScreenMode>
            <View>
              <Disclaimer title="Note" texts={disclaimerMessage} />
              <Divider size={formatSize(28)} />
              <FormikProvider value={formik}>
                <TopUpFormAssetAmountInput
                  name="coinFrom"
                  label="Send"
                  isSearchable
                  assetsList={filteredInputCurrenciesList}
                  onValueChange={handleInputValueChange}
                  tokenTestID={InitialStepSelectors.sendTokenChange}
                  setSearchValue={setSearchValue}
                />
                <Divider size={formatSize(8)} />
                <View style={styles.iconContainer}>
                  <Icon name={IconNameEnum.ArrowDown} size={formatSize(24)} />
                </View>
                <Divider size={formatSize(8)} />
                <TopUpFormAssetAmountInput
                  name="coinTo"
                  label="Get"
                  editable={false}
                  singleAsset={outputCurrencies.length === 1}
                  assetsList={outputCurrencies}
                  onValueChange={handleOutputValueChange}
                  tokenTestID={InitialStepSelectors.getTokenChange}
                />
              </FormikProvider>
              <Divider size={formatSize(16)} />
              <View style={styles.exchangeContainer}>
                <Text style={styles.exchangeRate}>Exchange Rate</Text>
                <Text style={styles.exchangeRateValue}>
                  {values.rate === 0 ? '---' : `1 ${inputCurrency.code} ≈ ${values.rate} ${outputCurrency.code}`}
                </Text>
              </View>
              <Divider size={formatSize(16)} />
            </View>
            <View>
              <View>
                <Text style={styles.termsOfUse}>By clicking Exchange you agree with</Text>
                <View style={styles.row}>
                  <BlackTextLink url={EXOLIX_TERMS_LINK}>Terms of Use</BlackTextLink>
                  <Divider size={formatSize(4)} />
                  <Text style={styles.termsOfUse}>and</Text>
                  <Divider size={formatSize(4)} />
                  <BlackTextLink url={EXOLIX_PRIVICY_LINK}>Privacy Policy</BlackTextLink>
                </View>
              </View>
              <Divider size={formatSize(16)} />
              <Text style={styles.thirdParty}>
                The token exchange feature is provided by Exolix as a third party provider. Temple wallet is not
                responsible for the work of third-party services.
              </Text>
            </View>
          </ScreenContainer>
          <ButtonsFloatingContainer>
            <ButtonLargePrimary title="Top Up" disabled={submitCount !== 0 && !isValid} onPress={submitForm} />
          </ButtonsFloatingContainer>
        </>
      ) : (
        <ErrorComponent setIsError={setIsError} />
      )}
    </>
  );
};
