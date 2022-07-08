import { BigNumber } from 'bignumber.js';
import { FormikProvider, useFormik } from 'formik';
import React, { FC, useCallback } from 'react';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from '../../../components/button/buttons-floating-container/buttons-floating-container';
import { Disclaimer } from '../../../components/disclaimer/disclaimer';
import { Divider } from '../../../components/divider/divider';
import { BlackTextLink } from '../../../components/text-link/black-text-link';
// import { CurrenciesInterface } from '../../../interfaces/exolix.interface';
import { loadExolixExchangeDataActions } from '../../../store/exolix/exolix-actions';
// import { useExolixCurrencies, useExolixExchangeData, useExolixStep } from '../../../store/exolix/exolix-selectors';
import { useSelectedAccountSelector } from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import { ErrorComponent } from './error-component';
import { ExolixFormAssetAmountInput } from './exolix-form-asset-input/exolix-form-asset-input';
import { exolixTopupFormValidationSchema, ExolixTopupFormValues } from './exolix-topup.form';
import { useExolixStyles } from './exolix.styles';
import { initialData, outputCoin } from './initial-step.data';
import { useFilteredCurrenciesList } from './use-filtered-currencies-list.hook';

interface InitialStepProps {
  isError: boolean;
  setIsError: (b: boolean) => void;
}

export const InitialStep: FC<InitialStepProps> = ({ isError, setIsError }) => {
  const styles = useExolixStyles();
  const { filteredCurrenciesList, setSearchValue } = useFilteredCurrenciesList();
  const dispatch = useDispatch();
  const { publicKeyHash } = useSelectedAccountSelector();

  const handleSubmit = useCallback(() => {
    dispatch(
      loadExolixExchangeDataActions.submit({
        coinFrom: values.coinFrom.asset.code,
        coinTo: outputCoin.code,
        amount: (values.coinFrom.amount ?? new BigNumber(0)).toNumber(),
        withdrawalAddress: publicKeyHash,
        withdrawalExtraId: ''
      })
    );
  }, [dispatch]);

  const formik = useFormik<ExolixTopupFormValues>({
    initialValues: initialData,
    validationSchema: exolixTopupFormValidationSchema,
    onSubmit: handleSubmit
  });
  const { values, isValid, submitForm } = formik;

  // console.log(values);

  // const handleInputAssetsValueChange = (value: ExolixAssetAmountInterface) => {
  //   setFieldValue('coinFrom', value.asset);
  //   setFieldValue('amount', value.amount);
  // };

  return (
    <>
      {!isError ? (
        <>
          <View style={styles.initialStepContainer}>
            <View>
              <Disclaimer
                title="Note"
                texts={[
                  'For DOGE: transfer network - MainNet DOGE.',
                  'Please, deposit only DOGE (MainNet).',
                  'Otherwise, you may lose your assets',
                  'permanently.'
                ]}
              />
              <Divider size={formatSize(28)} />
              <FormikProvider value={formik}>
                <ExolixFormAssetAmountInput
                  name="coinFrom"
                  label="Send"
                  isSearchable
                  assetsList={filteredCurrenciesList}
                  setSearchValue={setSearchValue}
                />
                <ExolixFormAssetAmountInput
                  name="coinTo"
                  label="Get"
                  editable={false}
                  assetsList={filteredCurrenciesList}
                  setSearchValue={setSearchValue}
                />
              </FormikProvider>
              {/* Exchange rate */}
              {/* horizontal divider */}
            </View>
            <View>
              <View>
                <Text style={styles.termsOfUse}>By clicking Exchange you agree with</Text>
                <View style={styles.row}>
                  <BlackTextLink url="https://exolix.com/terms">Terms of Use</BlackTextLink>
                  <Divider size={formatSize(4)} />
                  <Text style={styles.termsOfUse}>and</Text>
                  <Divider size={formatSize(4)} />
                  <BlackTextLink url="https://exolix.com/privacy">Privacy Policy</BlackTextLink>
                </View>
              </View>
              <Divider size={formatSize(16)} />
              <Text style={styles.thirdParty}>
                The token exchange feature is provided by a third party. The Temple wallet is not responsible for the
                work of third-party services.
              </Text>
            </View>
          </View>
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
