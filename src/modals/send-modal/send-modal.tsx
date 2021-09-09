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
import { useFilteredAssetsList } from '../../hooks/use-filtered-assets-list.hook';
import { ModalsEnum, ModalsParamList } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { sendAssetActions } from '../../store/wallet/wallet-actions';
import {
  useSelectedAccountSelector,
  useTezosTokenSelector,
  useAssetsListSelector,
  useVisibleAccountsListSelector
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
  const visibleAccounts = useVisibleAccountsListSelector();
  const assetsList = useAssetsListSelector();
  const { filteredAssetsList } = useFilteredAssetsList(assetsList, true);
  const tezosToken = useTezosTokenSelector();

  const filteredAssetsListWithTez = useMemo<TokenInterface[]>(
    () => [tezosToken, ...filteredAssetsList],
    [tezosToken, filteredAssetsList]
  );

  const ownAccountsReceivers = useMemo(
    () => visibleAccounts.filter(({ publicKeyHash }) => publicKeyHash !== sender.publicKeyHash),
    [visibleAccounts, sender.publicKeyHash]
  );
  const transferBetweenOwnAccountsDisabled = ownAccountsReceivers.length === 0;

  const sendModalInitialValues = useMemo<SendModalFormValues>(
    () => ({
      asset: filteredAssetsListWithTez.find(item => tokenEqualityFn(item, initialToken)) ?? emptyToken,
      receiverPublicKeyHash: initialRecieverPublicKeyHash,
      amount: undefined,
      ownAccount: ownAccountsReceivers[0],
      transferBetweenOwnAccounts: false
    }),
    [filteredAssetsListWithTez, ownAccountsReceivers]
  );

  const onSubmit = ({
    asset,
    receiverPublicKeyHash,
    ownAccount,
    transferBetweenOwnAccounts,
    amount
  }: SendModalFormValues) =>
    void (
      isDefined(amount) &&
      dispatch(
        sendAssetActions.submit({
          asset,
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
        useEffect(() => setFieldValue('amount', undefined), [values.asset]);

        const amountMaxValue = BigNumber.max(
          mutezToTz(new BigNumber(values.asset.balance), values.asset.decimals).minus(
            values.asset.symbol === TEZ_TOKEN_METADATA.symbol ? TEZ_MAX_FEE : 0
          ),
          0
        );

        return (
          <ScreenContainer isFullScreenMode={true}>
            <ModalStatusBar />
            <View>
              <Label label="Asset" description="Select asset or token." />
              <TokenFormDropdown name="asset" list={filteredAssetsListWithTez} />
              <Divider />

              <Label label="To" description={`Address or Tezos domain to send ${values.asset.symbol} funds to.`} />
              {values.transferBetweenOwnAccounts ? (
                <AccountFormDropdown name="ownAccount" list={ownAccountsReceivers} />
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

              <Label label="Amount" description={`Set ${values.asset.symbol} amount to send.`} />
              <FormNumericInput
                name="amount"
                maxValue={amountMaxValue}
                decimals={values.asset.decimals}
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
