import { RouteProp, useRoute } from '@react-navigation/core';
import { BigNumber } from 'bignumber.js';
import { Formik } from 'formik';
import React, { FC, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from '../../components/button/buttons-container/buttons-container';
import { Divider } from '../../components/divider/divider';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { Label } from '../../components/label/label';
import { ModalStatusBar } from '../../components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { tokenEqualityFn } from '../../components/token-dropdown/token-equality-fn';
import { TokenFormDropdown } from '../../components/token-dropdown/token-form-dropdown';
import { FormAddressInput } from '../../form/form-address-input';
import { FormNumericInput } from '../../form/form-numeric-input/form-numeric-input';
import { ModalsEnum, ModalsParamList } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { sendAssetActions } from '../../store/wallet/wallet-actions';
import { useSelectedAccountSelector, useTokensListSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { TEZ_TOKEN_METADATA } from '../../token/data/tokens-metadata';
import { emptyToken, TokenInterface } from '../../token/interfaces/token.interface';
import { isDefined } from '../../utils/is-defined';
import { SendModalFormValues, sendModalValidationSchema } from './send-modal.form';

// TODO: load real fee instead
const TEZ_MAX_FEE = 0.1;

export const SendModal: FC = () => {
  const dispatch = useDispatch();
  const { asset: initialAsset } = useRoute<RouteProp<ModalsParamList, ModalsEnum.Send>>().params;
  const { goBack } = useNavigation();

  const tokensList = useTokensListSelector();
  const selectedAccount = useSelectedAccountSelector();

  const tokensListWithTez = useMemo<TokenInterface[]>(
    () => [
      {
        ...emptyToken,
        ...TEZ_TOKEN_METADATA,
        balance: selectedAccount.tezosBalance.data
      },
      ...tokensList
    ],
    [selectedAccount.tezosBalance.data, tokensList]
  );

  const sendModalInitialValues = useMemo<SendModalFormValues>(
    () => ({
      token: tokensListWithTez.find(item => tokenEqualityFn(item, initialAsset)) ?? emptyToken,
      receiverPublicKeyHash: '',
      amount: undefined
    }),
    [tokensListWithTez]
  );

  const onSubmit = ({ token, receiverPublicKeyHash, amount }: SendModalFormValues) =>
    void (
      isDefined(amount) &&
      dispatch(
        sendAssetActions.submit({
          asset: token,
          receiverPublicKeyHash,
          amount: amount.toNumber()
        })
      )
    );

  return (
    <Formik
      initialValues={sendModalInitialValues}
      enableReinitialize={true}
      validationSchema={sendModalValidationSchema}
      onSubmit={onSubmit}>
      {({ values, setFieldValue, submitForm }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => setFieldValue('amount', undefined), [values.token]);

        const amountMaxValue = BigNumber.max(
          new BigNumber(values.token.balance).minus(
            values.token.symbol === TEZ_TOKEN_METADATA.symbol ? TEZ_MAX_FEE : 0
          ),
          0
        );

        return (
          <ScreenContainer isFullScreenMode={true}>
            <ModalStatusBar />
            <View>
              <Label label="Asset" description="Select asset or token." />
              <TokenFormDropdown name="token" list={tokensListWithTez} />
              <Divider />

              <Label label="To" description={`Address or Tezos domain to send ${values.token.symbol} funds to.`} />
              <FormAddressInput name="receiverPublicKeyHash" placeholder="e.g. address" />
              <Divider />

              <Label label="Amount" description={`Set ${values.token.symbol} amount to send.`} />
              <FormNumericInput
                name="amount"
                maxValue={amountMaxValue}
                decimals={values.token.decimals}
                placeholder="0.00"
              />
              <Divider />
            </View>

            <View>
              <ButtonsContainer>
                <ButtonLargeSecondary title="Close" onPress={goBack} />
                <Divider size={formatSize(16)} />
                <ButtonLargePrimary title="Send" onPress={submitForm} />
              </ButtonsContainer>

              <InsetSubstitute type="bottom" />
            </View>
          </ScreenContainer>
        );
      }}
    </Formik>
  );
};
