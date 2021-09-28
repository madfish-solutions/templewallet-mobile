import { RouteProp, useRoute } from '@react-navigation/core';
import { Formik } from 'formik';
import React, { FC, useMemo, useState } from 'react';
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
import { FormAddressInput } from '../../form/form-address-input';
import { FormAssetAmountInput } from '../../form/form-asset-amount-input/form-asset-amount-input';
import { FormCheckbox } from '../../form/form-checkbox';
import { useFilteredAssetsList } from '../../hooks/use-filtered-assets-list.hook';
import { ModalsEnum, ModalsParamList } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { sendAssetActions } from '../../store/wallet/wallet-actions';
import {
  useAssetsListSelector,
  useSelectedAccountSelector,
  useTezosTokenSelector,
  useVisibleAccountsListSelector
} from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { showWarningToast, showErrorToast } from '../../toast/toast.utils';
import { emptyToken, TokenInterface } from '../../token/interfaces/token.interface';
import { isTezosDomainNameValid, isTezosDomainsSupported } from '../../utils/dns.utils';
import { isDefined } from '../../utils/is-defined';
import { createReadOnlyTezosToolkit } from '../../utils/network/tezos-toolkit.utils';
import { SendModalFormValues, sendModalValidationSchema } from './send-modal.form';
import { useSendModalStyles } from './send-modal.styles';

export const SendModal: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
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

  const tezos = createReadOnlyTezosToolkit(sender);
  const { resolver: domainsResolver } = isTezosDomainsSupported(tezos);

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
      assetAmount: {
        asset: filteredAssetsListWithTez.find(item => tokenEqualityFn(item, initialToken)) ?? emptyToken,
        amount: undefined
      },
      receiverPublicKeyHash: initialRecieverPublicKeyHash,
      ownAccount: ownAccountsReceivers[0],
      transferBetweenOwnAccounts: false
    }),
    [filteredAssetsListWithTez, ownAccountsReceivers]
  );

  const onSubmit = async ({
    assetAmount: { asset, amount },
    receiverPublicKeyHash,
    ownAccount,
    transferBetweenOwnAccounts
  }: SendModalFormValues) => {
    if (isTezosDomainNameValid(receiverPublicKeyHash)) {
      setIsLoading(true);
      const address = await domainsResolver.resolveNameToAddress(receiverPublicKeyHash);
      if (address !== null) {
        receiverPublicKeyHash = address;
        setIsLoading(false);
      } else {
        showErrorToast({ title: 'Error!', description: 'Your address has been expired' });
        setIsLoading(false);

        return;
      }
    }

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
  };

  return (
    <Formik
      initialValues={sendModalInitialValues}
      enableReinitialize={true}
      validationSchema={sendModalValidationSchema}
      onSubmit={onSubmit}>
      {({ values, submitForm }) => (
        <ScreenContainer isFullScreenMode={true}>
          <ModalStatusBar />
          <View>
            <Divider size={formatSize(8)} />
            <FormAssetAmountInput name="assetAmount" label="Asset" assetsList={filteredAssetsListWithTez} />
            <Divider />

            <Label
              label="To"
              description={`Address or Tezos domain to send ${values.assetAmount.asset.symbol} funds to.`}
            />
            {values.transferBetweenOwnAccounts ? (
              <>
                <AccountFormDropdown name="ownAccount" list={ownAccountsReceivers} />
                <Divider size={formatSize(10)} />
              </>
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

            <Divider />
          </View>

          <View>
            <ButtonsContainer>
              <ButtonLargeSecondary title="Close" onPress={goBack} disabled={isLoading} />
              <Divider size={formatSize(16)} />
              <ButtonLargePrimary title="Send" onPress={submitForm} disabled={isLoading} />
            </ButtonsContainer>

            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
