import { BigNumber } from 'bignumber.js';
import { FormikProvider, useFormik } from 'formik';
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from '../../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from '../../../../components/button/buttons-floating-container/buttons-floating-container';
import { Disclaimer } from '../../../../components/disclaimer/disclaimer';
import { Divider } from '../../../../components/divider/divider';
import { Icon } from '../../../../components/icon/icon';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { BlackTextLink } from '../../../../components/text-link/black-text-link';
import { RateInterface } from '../../../../interfaces/exolix.interface';
import { useUsdToTokenRates } from '../../../../store/currency/currency-selectors';
import { loadExolixExchangeDataActions } from '../../../../store/exolix/exolix-actions';
import { useSelectedAccountSelector } from '../../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../../styles/format-size';
import { loadExolixRate } from '../../../../utils/exolix.util';
import { isDefined } from '../../../../utils/is-defined';
import { ErrorComponent } from '../error-component';
import { ExolixAssetAmountInterface } from '../exolix-form-asset-input/exolix-asset-amount-input';
import { ExolixFormAssetAmountInput } from '../exolix-form-asset-input/exolix-form-asset-input';
import { exolixTopupFormValidationSchema, ExolixTopupFormValues } from '../exolix-topup.form';
import { useExolixStyles } from '../exolix.styles';
import { useFilteredCurrenciesList } from '../use-filtered-currencies-list.hook';
import { initialData, outputCoin } from './initial-step.data';
import { loadMinMaxFields } from './initial-step.utils';

interface InitialStepProps {
  isError: boolean;
  setIsError: (b: boolean) => void;
}

export const InitialStep: FC<InitialStepProps> = ({ isError, setIsError }) => {
  const styles = useExolixStyles();
  const { filteredCurrenciesList, setSearchValue } = useFilteredCurrenciesList();
  const dispatch = useDispatch();
  const { publicKeyHash } = useSelectedAccountSelector();

  const prices = useUsdToTokenRates();
  const tezPrice = useMemo(() => {
    if (isDefined(prices) && isDefined(prices.tezos)) {
      return prices.tezos;
    } else {
      return 1;
    }
  }, [prices]);

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
  const { values, isValid, submitForm, setFieldValue } = formik;

  useEffect(() => {
    loadMinMaxFields(setFieldValue, values.coinFrom.asset.code, tezPrice);
  }, [values.coinFrom.asset.code, tezPrice]);

  const handleInputAmountChange = (asset: ExolixAssetAmountInterface) => {
    const requestData = {
      coinFrom: asset.asset.code,
      coinTo: initialData.coinTo.asset.code, // TEZ
      amount: isDefined(asset.amount) ? asset.amount.toNumber() : 0
    };

    loadExolixRate(requestData).then((responseData: RateInterface) => {
      setFieldValue('coinTo.amount', new BigNumber(responseData.toAmount));
    });
  };

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
                  onValueChange={handleInputAmountChange}
                  setSearchValue={setSearchValue}
                />
                <Divider size={formatSize(8)} />
                <View style={styles.iconContainer}>
                  <Icon name={IconNameEnum.ArrowDown} size={formatSize(24)} />
                </View>
                <Divider size={formatSize(8)} />
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
