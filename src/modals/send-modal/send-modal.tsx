import { RouteProp, useRoute } from '@react-navigation/core';
import { BigNumber } from 'bignumber.js';
import { Formik } from 'formik';
import React, { FC, useEffect, useMemo } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { AccountFormDropdown } from '../../components/account-dropdown/account-form-dropdown';
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
import { FormCheckbox } from '../../form/form-checkbox';
import { FormNumericInput } from '../../form/form-numeric-input/form-numeric-input';
import { useFilteredTokenList } from '../../hooks/use-filtered-token-list.hook';
import { ModalsEnum, ModalsParamList } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { sendAssetActions } from '../../store/wallet/wallet-actions';
import {
  useAccountsListSelector,
  useSelectedAccountSelector,
  useTezosTokenSelector,
  useTokensListSelector
} from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { showWarningToast } from '../../toast/toast.utils';
import { TEZ_TOKEN_METADATA } from '../../token/data/tokens-metadata';
import { emptyToken, TokenInterface } from '../../token/interfaces/token.interface';
import { isDefined } from '../../utils/is-defined';
import { mutezToTz } from '../../utils/tezos.util';
import { SendModalFormValues, sendModalValidationSchema } from './send-modal.form';
import { useSendModalStyles } from './send-modal.styles';

// TODO: load real fee instead
const TEZ_MAX_FEE = 0.1;

export const SendModal: FC = () => {
  const dispatch = useDispatch();
  const { token: initialToken, receiverPublicKeyHash: initialRecieverPublicKeyHash = '' } =
    useRoute<RouteProp<ModalsParamList, ModalsEnum.Send>>().params;
  const { goBack } = useNavigation();

  const sender = useSelectedAccountSelector();
  const styles = useSendModalStyles();
  const accounts = useAccountsListSelector();
  const tokensList = useTokensListSelector();
  const { filteredTokensList } = useFilteredTokenList(tokensList, true);
  const tezosToken = useTezosTokenSelector();

  const filteredTokensListWithTez = useMemo<TokenInterface[]>(
    () => [tezosToken, ...filteredTokensList],
    [tezosToken, filteredTokensList]
  );

  const ownAccountsReceivers = useMemo(
    () => accounts.filter(({ publicKeyHash }) => publicKeyHash !== sender.publicKeyHash),
    [accounts, sender.publicKeyHash]
  );
  const transferBetweenOwnAccountsDisabled = ownAccountsReceivers.length === 0;

  const sendModalInitialValues = useMemo<SendModalFormValues>(
    () => ({
      token: filteredTokensListWithTez.find(item => tokenEqualityFn(item, initialToken)) ?? emptyToken,
      receiverPublicKeyHash: initialRecieverPublicKeyHash,
      amount: undefined,
      ownAccount: ownAccountsReceivers[0],
      transferBetweenOwnAccounts: false
    }),
    [filteredTokensListWithTez, ownAccountsReceivers]
  );

  const onSubmit = ({
    token,
    receiverPublicKeyHash,
    ownAccount,
    transferBetweenOwnAccounts,
    amount
  }: SendModalFormValues) =>
    void (
      isDefined(amount) &&
      dispatch(
        sendAssetActions.submit({
          token,
          receiverPublicKeyHash: transferBetweenOwnAccounts ? ownAccount.publicKeyHash : receiverPublicKeyHash,
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
          mutezToTz(new BigNumber(values.token.balance), values.token.decimals).minus(
            values.token.symbol === TEZ_TOKEN_METADATA.symbol ? TEZ_MAX_FEE : 0
          ),
          0
        );

        return (
          <ScreenContainer isFullScreenMode={true}>
            <ModalStatusBar />
            <View>
              <Label label="Asset" description="Select asset or token." />
              <TokenFormDropdown name="token" list={filteredTokensListWithTez} />
              <Divider />

              <Label label="To" description={`Address or Tezos domain to send ${values.token.symbol} funds to.`} />
              {values.transferBetweenOwnAccounts ? (
                <AccountFormDropdown name="ownAccount" list={accounts} />
              ) : (
                <FormAddressInput name="receiverPublicKeyHash" placeholder="e.g. address" />
              )}
              <View
                onTouchStart={() =>
                  void (
                    transferBetweenOwnAccountsDisabled && showWarningToast({ description: 'Create one more account' })
                  )
                }>
                <FormCheckbox
                  disabled={transferBetweenOwnAccountsDisabled}
                  name="transferBetweenOwnAccounts"
                  size={formatSize(16)}>
                  <Text style={styles.checkboxText}>Transfer between my accounts</Text>
                </FormCheckbox>
              </View>
              <Divider size={formatSize(12)} />

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
