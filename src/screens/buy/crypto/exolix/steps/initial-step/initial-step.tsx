import { FormikProvider, useFormik } from 'formik';
import React, { FC, useEffect, useMemo } from 'react';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from '../../../../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from '../../../../../../components/button/buttons-floating-container/buttons-floating-container';
import { Disclaimer } from '../../../../../../components/disclaimer/disclaimer';
import { Divider } from '../../../../../../components/divider/divider';
import { Icon } from '../../../../../../components/icon/icon';
import { IconNameEnum } from '../../../../../../components/icon/icon-name.enum';
import { ScreenContainer } from '../../../../../../components/screen-container/screen-container';
import { BlackTextLink } from '../../../../../../components/text-link/black-text-link';
import { useTokenExchangeRateGetter } from '../../../../../../hooks/use-token-exchange-rate-getter.hook';
import { loadExolixExchangeDataActions } from '../../../../../../store/exolix/exolix-actions';
import { useSelectedAccountSelector } from '../../../../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../../../../styles/format-size';
import { isDefined } from '../../../../../../utils/is-defined';
import { TopUpAssetAmountInterface } from '../../../../components/top-up-asset-amount-input/top-up-asset-amount-input.props';
import { TopUpFormAssetAmountInput } from '../../../../components/top-up-form-asset-amount-input/top-up-form-asset-amount-input';
import { ErrorComponent } from '../../components/error-component';
import { EXOLIX_PRIVICY_LINK, EXOLIX_TERMS_LINK, outputTokensList } from '../../config';
import { exolixTopupFormValidationSchema, ExolixTopupFormValues } from '../../exolix-topup.form';
import { useFilteredCurrenciesList } from '../../hooks/use-filtered-currencies-list.hook';
import { initialData } from './initial-step.data';
import { useInitialStepStyles } from './initial-step.styles';
import { getProperNetworkFullName, loadMinMaxFields, updateOutputInputValue } from './initial-step.utils';

interface InitialStepProps {
  isError: boolean;
  setIsError: (b: boolean) => void;
}

export const InitialStep: FC<InitialStepProps> = ({ isError, setIsError }) => {
  const dispatch = useDispatch();
  const styles = useInitialStepStyles();

  const { filteredCurrenciesList, setSearchValue } = useFilteredCurrenciesList();
  const { publicKeyHash } = useSelectedAccountSelector();
  const getTokenExchangeRate = useTokenExchangeRateGetter();

  const handleSubmit = () => {
    if (!isDefined(values.coinFrom.amount)) {
      return;
    }
    dispatch(
      loadExolixExchangeDataActions.submit({
        coinFrom: inputCurrency.code,
        networkFrom: inputCurrency.network,
        coinTo: outputCurrency.code,
        networkTo: outputCurrency.network,
        amount: values.coinFrom.amount.toNumber(),
        withdrawalAddress: publicKeyHash,
        withdrawalExtraId: ''
      })
    );
  };

  const formik = useFormik<ExolixTopupFormValues>({
    initialValues: initialData,
    validationSchema: exolixTopupFormValidationSchema,
    onSubmit: handleSubmit
  });
  const { values, isValid, submitForm, setFieldValue } = formik;

  const inputCurrency = values.coinFrom.asset;
  const outputCurrency = values.coinTo.asset;

  const outputTokenPrice = useMemo(() => getTokenExchangeRate(outputCurrency.slug), [outputCurrency.code]);

  useEffect(() => {
    loadMinMaxFields(
      setFieldValue,
      inputCurrency.code,
      inputCurrency.network,
      outputCurrency.code,
      outputCurrency.network,
      outputTokenPrice
    );
  }, [inputCurrency.code, outputTokenPrice]);

  const handleInputValueChange = (inputCurrency: TopUpAssetAmountInterface) => {
    const requestData = {
      coinFrom: inputCurrency.asset.code,
      coinFromNetwork: inputCurrency.asset.network,
      coinTo: outputCurrency.code,
      coinToNetwork: outputCurrency.network,
      amount: isDefined(inputCurrency.amount) ? inputCurrency.amount.toNumber() : 0
    };

    updateOutputInputValue(requestData, setFieldValue);
  };

  const handleOutputValueChange = (outputCurrency: TopUpAssetAmountInterface) => {
    const requestData = {
      coinFrom: inputCurrency.code,
      coinFromNetwork: inputCurrency.network,
      coinTo: outputCurrency.asset.code,
      coinToNetwork: outputCurrency.asset.network,
      amount: isDefined(values.coinFrom.amount) ? values.coinFrom.amount.toNumber() : 0
    };

    updateOutputInputValue(requestData, setFieldValue);
  };

  const disclaimerMessage = useMemo(
    () => [
      `Please, deposit only ${inputCurrency.name} transfer network ${getProperNetworkFullName(inputCurrency)}.`,
      'Otherwise, you may lose your assets',
      'permanently.'
    ],
    [inputCurrency.name]
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
                  assetsList={filteredCurrenciesList}
                  onValueChange={handleInputValueChange}
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
                  assetsList={outputTokensList}
                  onValueChange={handleOutputValueChange}
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
                The token exchange feature is provided by a third party. The Temple wallet is not responsible for the
                work of third-party services.
              </Text>
            </View>
          </ScreenContainer>
          <ButtonsFloatingContainer>
            <ButtonLargePrimary disabled={!isValid} title="Top Up" onPress={submitForm} />
          </ButtonsFloatingContainer>
        </>
      ) : (
        <ErrorComponent setIsError={setIsError} />
      )}
    </>
  );
};
