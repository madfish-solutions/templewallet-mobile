import { RouteProp, useRoute } from '@react-navigation/core';
import { FormikProvider, useFormik } from 'formik';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { AccountFormSectionDropdown } from 'src/components/account-dropdown/account-form-section-dropdown';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from 'src/components/button/buttons-container/buttons-container';
import { Divider } from 'src/components/divider/divider';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Label } from 'src/components/label/label';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { tokenEqualityFn } from 'src/components/token-dropdown/token-equality-fn';
import { FormAddressInput } from 'src/form/form-address-input';
import { FormAssetAmountInput } from 'src/form/form-asset-amount-input/form-asset-amount-input';
import { FormCheckbox } from 'src/form/form-checkbox';
import { useAddressFieldAnalytics } from 'src/hooks/use-address-field-analytics.hook';
import { useFilteredAssetsList } from 'src/hooks/use-filtered-assets-list.hook';
import { useFilteredReceiversList } from 'src/hooks/use-filtered-receivers-list.hook';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { ModalsEnum, ModalsParamList } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { addContactCandidateAddressAction } from 'src/store/contact-book/contact-book-actions';
import { sendAssetActions } from 'src/store/wallet/wallet-actions';
import {
  useSelectedAccountSelector,
  useSelectedAccountTezosTokenSelector,
  useVisibleAssetListSelector
} from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { showWarningToast, showErrorToast } from 'src/toast/toast.utils';
import { emptyTezosLikeToken } from 'src/token/interfaces/token.interface';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { isTezosDomainNameValid, tezosDomainsResolver } from 'src/utils/dns.utils';
import { isDefined } from 'src/utils/is-defined';
import { isValidAddress } from 'src/utils/tezos.util';

import { SendModalFormValues, sendModalValidationSchema } from './send-modal.form';
import { SendModalSelectors } from './send-modal.selectors';
import { useSendModalStyles } from './send-modal.styles';

export const SendModal: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { token: initialToken, receiverPublicKeyHash: initialRecieverPublicKeyHash = '' } =
    useRoute<RouteProp<ModalsParamList, ModalsEnum.Send>>().params;
  const { goBack } = useNavigation();

  const selectedAccount = useSelectedAccountSelector();
  const styles = useSendModalStyles();
  const assetsList = useVisibleAssetListSelector();
  const tezosToken = useSelectedAccountTezosTokenSelector();
  const leadingAssets = useMemo(() => [tezosToken], [tezosToken]);

  const { filteredAssetsList, setSearchValue } = useFilteredAssetsList(assetsList, true, true, leadingAssets);
  const { filteredReceiversList, handleSearchValueChange } = useFilteredReceiversList();

  const tezos = useReadOnlyTezosToolkit(selectedAccount);
  const resolver = useMemo(() => tezosDomainsResolver(tezos), [tezos]);

  const isTransferDisabled = filteredReceiversList.length === 0;
  const recipient = filteredReceiversList[0]?.data[0];

  const sendModalInitialValues = useMemo<SendModalFormValues>(
    () => ({
      assetAmount: {
        asset: filteredAssetsList.find(item => tokenEqualityFn(item, initialToken)) ?? emptyTezosLikeToken,
        amount: undefined
      },
      receiverPublicKeyHash: initialRecieverPublicKeyHash,
      recipient,
      transferBetweenOwnAccounts: false
    }),
    [filteredAssetsList]
  );

  const onSubmit = useCallback(
    async ({
      assetAmount: { asset, amount },
      receiverPublicKeyHash,
      recipient,
      transferBetweenOwnAccounts
    }: SendModalFormValues) => {
      if (isTezosDomainNameValid(receiverPublicKeyHash) && !transferBetweenOwnAccounts) {
        setIsLoading(true);

        const address = await resolver.resolveNameToAddress(receiverPublicKeyHash).catch(() => null);
        setIsLoading(false);
        if (address !== null) {
          receiverPublicKeyHash = address;
        } else if (!isValidAddress(receiverPublicKeyHash)) {
          showErrorToast({ title: 'Error!', description: 'Your address has been expired' });

          return;
        }
      }

      void (isDefined(amount) &&
        dispatch(
          sendAssetActions.submit({
            asset,
            receiverPublicKeyHash: transferBetweenOwnAccounts ? recipient.publicKeyHash : receiverPublicKeyHash,
            amount: amount.toNumber()
          })
        ),
      !transferBetweenOwnAccounts && dispatch(addContactCandidateAddressAction(receiverPublicKeyHash)));
    },
    [resolver, dispatch]
  );

  const formik = useFormik({
    initialValues: sendModalInitialValues,
    validationSchema: sendModalValidationSchema,
    onSubmit,
    enableReinitialize: true
  });
  const { errors, values, submitForm } = formik;

  usePageAnalytic(ModalsEnum.Send);
  const { onBlur: handleAddressInputBlur } = useAddressFieldAnalytics(
    'RECIPIENT_NETWORK',
    'receiverPublicKeyHash' as const,
    formik
  );

  return (
    <FormikProvider value={formik}>
      <ScreenContainer isFullScreenMode={true}>
        <ModalStatusBar />

        <View>
          <Divider size={formatSize(8)} />
          <FormAssetAmountInput
            maxButton
            name="assetAmount"
            label="Asset"
            assetsList={filteredAssetsList}
            isSearchable
            setSearchValue={setSearchValue}
            testID={SendModalSelectors.assetInput}
            tokenTestID={SendModalSelectors.tokenChange}
            maxButtonTestID={SendModalSelectors.maxButton}
            switcherTestID={SendModalSelectors.switcherButton}
          />
          <Divider />

          <Label
            label="To"
            description={`Address or Tezos domain to send ${values.assetAmount.asset.symbol} funds to.`}
          />
          {values.transferBetweenOwnAccounts ? (
            <>
              <AccountFormSectionDropdown
                name="recipient"
                list={filteredReceiversList}
                setSearchValue={handleSearchValueChange}
                testID={SendModalSelectors.sectionDropdown}
              />
              <Divider size={formatSize(10)} />
            </>
          ) : (
            <FormAddressInput
              name="receiverPublicKeyHash"
              onBlur={handleAddressInputBlur}
              placeholder="e.g. address"
              testID={SendModalSelectors.toInput}
              pasteButtonTestID={SendModalSelectors.pasteAddressButton}
            />
          )}

          <View
            onTouchStart={() =>
              void (isTransferDisabled && showWarningToast({ description: 'Create one more account or contact' }))
            }
          >
            <FormCheckbox
              disabled={isTransferDisabled}
              name="transferBetweenOwnAccounts"
              size={formatSize(16)}
              testID={SendModalSelectors.transferBetweenMyAccountsCheckBox}
            >
              <Text style={styles.checkboxText}>Transfer between my accounts or contacts</Text>
            </FormCheckbox>
          </View>

          <Divider />
        </View>

        <View>
          <ButtonsContainer>
            <ButtonLargeSecondary
              title="Close"
              onPress={goBack}
              disabled={isLoading}
              testID={SendModalSelectors.closeButton}
            />
            <Divider size={formatSize(16)} />
            <ButtonLargePrimary
              title="Send"
              onPress={submitForm}
              disabled={isLoading || Object.keys(errors).length > 0}
              testID={SendModalSelectors.sendButton}
            />
          </ButtonsContainer>

          <InsetSubstitute type="bottom" />
        </View>
      </ScreenContainer>
    </FormikProvider>
  );
};
