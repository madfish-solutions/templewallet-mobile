import { FormikProvider, useFormik } from 'formik';
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { BehaviorSubject } from 'rxjs';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { BlackTextLink } from 'src/components/text-link/black-text-link';
import { TopUpAssetAmountInterface, TopUpFormAssetAmountInput } from 'src/components/top-up-field';
import { emptyFn } from 'src/config/general';
import { loadExolixExchangeDataActions } from 'src/store/exolix/exolix-actions';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { ExchangePayload } from 'src/types/exolix.types';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { AnalyticsError } from 'src/utils/error-analytics-data.utils';
import { isDefined } from 'src/utils/is-defined';
import { getProperNetworkFullName } from 'src/utils/topup';

import { ErrorComponent } from '../../components/error-component';
import { EXOLIX_PRIVICY_LINK, EXOLIX_TERMS_LINK, initialFormValues } from '../../config';
import { exolixTopupFormValidationSchema, ExolixTopupFormValues } from '../../exolix-topup.form';
import { useFilteredCurrenciesList } from '../../hooks/use-filtered-currencies-list.hook';

import { InitialStepSelectors } from './initial-step.selectors';
import { useInitialStepStyles } from './initial-step.styles';
import { loadMinMaxFields, makeUpdateOutputInputValuePipeline$ } from './initial-step.utils';

interface InitialStepProps {
  isError: boolean;
  setIsError: (b: boolean) => void;
}

export const InitialStep: FC<InitialStepProps> = ({ isError, setIsError }) => {
  const dispatch = useDispatch();
  const styles = useInitialStepStyles();
  const { trackErrorEvent } = useAnalytics();

  const { inputCurrencies, outputCurrencies, filteredInputCurrenciesList, setSearchValue, currenciesLoading } =
    useFilteredCurrenciesList();
  const prevCurrenciesLoading = useRef(currenciesLoading);
  const publicKeyHash = useCurrentAccountPkhSelector();
  const [outputLoading, setOutputLoading] = useState(false);

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
  const { coinFrom, coinTo } = values;

  const inputCurrency = coinFrom.asset;
  const outputCurrency = coinTo.asset;

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

  const updateValuesPayload$ = useMemo(
    () =>
      new BehaviorSubject<
        (Omit<ExchangePayload, 'withdrawalAddress' | 'withdrawalExtraId'> & { errorName: string }) | null
      >(null),
    []
  );
  useEffect(() => {
    const pipeline$ = makeUpdateOutputInputValuePipeline$(
      updateValuesPayload$,
      setFieldValue,
      setOutputLoading,
      trackErrorEvent
    );

    const sub = pipeline$.subscribe(emptyFn);

    return () => sub.unsubscribe();
  }, [updateValuesPayload$, trackErrorEvent, setFieldValue]);

  useEffect(() => {
    if (
      prevCurrenciesLoading.current &&
      !currenciesLoading &&
      !isDefined(coinTo.amount) &&
      isDefined(coinFrom.amount)
    ) {
      updateValuesPayload$.next({
        coinFrom: inputCurrency.code,
        coinFromNetwork: inputCurrency.network.code,
        coinTo: outputCurrency.code,
        coinToNetwork: outputCurrency.network.code,
        amount: isDefined(coinFrom.amount) ? coinFrom.amount.toNumber() : 0,
        errorName: 'ExolixHandleCurrenciesLoadError'
      });
    }

    prevCurrenciesLoading.current = currenciesLoading;
  }, [coinFrom.amount, coinTo.amount, currenciesLoading, inputCurrency, outputCurrency, updateValuesPayload$]);

  const handleInputValueChange = (inputCurrency: TopUpAssetAmountInterface) => {
    const inputAssetCode = inputCurrency.asset.code;
    const inputAsset = inputCurrencies.find(item => item.code === inputAssetCode);
    if (!inputAsset && !currenciesLoading) {
      showErrorToast({ description: 'Selected asset not found' });
    }

    if (!inputAsset) {
      return;
    }

    updateValuesPayload$.next({
      coinFrom: inputAssetCode,
      coinFromNetwork: inputAsset.network.code,
      coinTo: outputCurrency.code,
      coinToNetwork: outputCurrency.network.code,
      amount: isDefined(inputCurrency.amount) ? inputCurrency.amount.toNumber() : 0,
      errorName: 'ExolixHandleInputValueChangeError'
    });
  };

  const handleOutputValueChange = (outputCurrency: TopUpAssetAmountInterface) => {
    const outputAssetCode = outputCurrency.asset.code;
    const outputAsset = outputCurrencies.find(item => item.code === outputAssetCode);
    if (!outputAsset && !currenciesLoading) {
      showErrorToast({ description: 'Selected asset not found' });
    }

    if (!outputAsset) {
      return;
    }

    updateValuesPayload$.next({
      coinFrom: inputCurrency.code,
      coinFromNetwork: inputCurrency.network.code,
      coinTo: outputAssetCode,
      coinToNetwork: outputAsset.network.code,
      amount: isDefined(coinFrom.amount) ? coinFrom.amount.toNumber() : 0,
      errorName: 'ExolixHandleOutputValueChangeError'
    });
  };

  const disclaimerMessage = useMemo(
    () => [
      `Please, deposit only ${inputCurrency.name} transfer network ${getProperNetworkFullName(inputCurrency)}. \
Otherwise, you may lose your assets permanently.`
    ],
    [inputCurrency]
  );

  const isLoading = currenciesLoading || outputLoading;

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
                  isLoading={currenciesLoading}
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
            <ButtonLargePrimary
              title={isLoading ? '' : 'Top Up'}
              disabled={submitCount !== 0 && !isValid}
              isLoading={isLoading}
              onPress={submitForm}
            />
          </ButtonsFloatingContainer>
        </>
      ) : (
        <ErrorComponent setIsError={setIsError} />
      )}
    </>
  );
};
