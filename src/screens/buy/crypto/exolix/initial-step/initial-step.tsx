import { BigNumber } from 'bignumber.js';
import { FormikProvider, useFormik } from 'formik';
import React, { FC, useEffect, useMemo } from 'react';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from '../../../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from '../../../../../components/button/buttons-floating-container/buttons-floating-container';
import { Disclaimer } from '../../../../../components/disclaimer/disclaimer';
import { Divider } from '../../../../../components/divider/divider';
import { Icon } from '../../../../../components/icon/icon';
import { IconNameEnum } from '../../../../../components/icon/icon-name.enum';
import { ScreenContainer } from '../../../../../components/screen-container/screen-container';
import { BlackTextLink } from '../../../../../components/text-link/black-text-link';
import { emptyFn } from '../../../../../config/general';
import { RateInterface } from '../../../../../interfaces/exolix.interface';
import { useUsdToTokenRates } from '../../../../../store/currency/currency-selectors';
import { loadExolixExchangeDataActions } from '../../../../../store/exolix/exolix-actions';
import { useSelectedAccountSelector } from '../../../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../../../styles/format-size';
import { loadExolixRate } from '../../../../../utils/exolix.util';
import { isDefined } from '../../../../../utils/is-defined';
import { TopUpAssetAmountInterface } from '../../../components/top-up-asset-amount-input/top-up-asset-amount-input.props';
import { TopUpFormAssetAmountInput } from '../../../components/top-up-form-asset-amount-input/top-up-form-asset-amount-input';
import { ErrorComponent } from '../error-component';
import { exolixTopupFormValidationSchema, ExolixTopupFormValues } from '../exolix-topup.form';
import { useFilteredCurrenciesList } from '../use-filtered-currencies-list.hook';
import { initialData, outputCoin } from './initial-step.data';
import { useInitialStepStyles } from './initial-step.styles';
import { loadMinMaxFields } from './initial-step.utils';

interface InitialStepProps {
  isError: boolean;
  setIsError: (b: boolean) => void;
}

const getTranslationTexts = (currency: string) => {
  if (currency === 'DOGE') {
    return [
      'for DOGE: transfer network - MainNet DOGE.',
      'Please, deposit only DOGE (MainNet).',
      'Otherwise, you may lose your assets',
      'permanently.'
    ];
  }
  if (currency === 'MATIC') {
    return [
      'for MATIC: transfer network - Ethereum (ETH).',
      'Please, deposit only MATIC (ERC20).',
      'Otherwise, you may lose your assets',
      'permanently.'
    ];
  }
  if (currency === 'USDT') {
    return [
      'for USDT: transfer network - Ethereum (ETH)',
      'ERC20.',
      'Please, deposit only USDT (ERC20).',
      'Otherwise, you may lose your assets',
      'permanently.'
    ];
  }
  if (currency === 'CAKE') {
    return [
      'for CAKE: transfer network - Binance Smart',
      'Chain (BSC).',
      'Please, deposit only CAKE (BEP20).',
      'Otherwise, you may lose your assets',
      'permanently.'
    ];
  }

  return undefined;
};

export const InitialStep: FC<InitialStepProps> = ({ isError, setIsError }) => {
  const styles = useInitialStepStyles();
  const { filteredCurrenciesList, setSearchValue } = useFilteredCurrenciesList();
  const dispatch = useDispatch();
  const { publicKeyHash } = useSelectedAccountSelector();

  const prices = useUsdToTokenRates();
  const tezPrice = useMemo(() => {
    if (isDefined(prices) && isDefined(prices.tez)) {
      return prices.tez;
    } else {
      return 1;
    }
  }, [prices]);

  const handleSubmit = () => {
    if (!isDefined(values.coinFrom.amount)) {
      return;
    }
    dispatch(
      loadExolixExchangeDataActions.submit({
        coinFrom: values.coinFrom.asset.code,
        coinFromNetwork: values.coinFrom.asset.network,
        coinTo: outputCoin.code,
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

  useEffect(() => {
    loadMinMaxFields(setFieldValue, values.coinFrom.asset.code, tezPrice);
  }, [values.coinFrom.asset.code, tezPrice]);

  const handleInputAmountChange = (asset: TopUpAssetAmountInterface) => {
    const requestData = {
      coinFrom: asset.asset.code,
      coinTo: initialData.coinTo.asset.code, // TEZ
      amount: isDefined(asset.amount) ? asset.amount.toNumber() : 0
    };

    loadExolixRate(requestData).then((responseData: RateInterface) => {
      if (isDefined(responseData.toAmount) && responseData.toAmount > 0) {
        setFieldValue('coinTo.amount', new BigNumber(responseData.toAmount));
      }
      if (isDefined(responseData.rate)) {
        setFieldValue('rate', responseData.rate);
      }
    });
  };

  const currency = values.coinFrom.asset.code;
  const disclaimerTexts = getTranslationTexts(currency);

  return (
    <>
      {!isError ? (
        <>
          <ScreenContainer isFullScreenMode>
            <View>
              {isDefined(disclaimerTexts) && <Disclaimer title="Note" texts={disclaimerTexts} />}
              <Divider size={formatSize(28)} />
              <FormikProvider value={formik}>
                <TopUpFormAssetAmountInput
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
                <TopUpFormAssetAmountInput
                  name="coinTo"
                  label="Get"
                  editable={false}
                  assetsList={[]}
                  setSearchValue={emptyFn}
                />
              </FormikProvider>
              <Divider size={formatSize(16)} />
              <View style={styles.exchangeContainer}>
                <Text style={styles.exchangeRate}>Exchange Rate</Text>
                <Text style={styles.exchangeRateValue}>
                  {values.rate === 0
                    ? '---'
                    : `1 ${values.coinFrom.asset.code} ≈ ${values.rate} ${values.coinTo.asset.code}`}
                </Text>
              </View>
              <Divider size={formatSize(16)} />
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
