import { useNavigation } from '@react-navigation/core';
import { FormikProvider, useFormik } from 'formik';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { AccountFormSectionDropdown } from 'src/components/account-dropdown/account-form-section-dropdown';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from 'src/components/divider/divider';
import { Label } from 'src/components/label/label';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { tokenEqualityFn } from 'src/components/token-dropdown/token-equality-fn';
import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { FormAddressInput } from 'src/form/form-address-input';
import { FormAssetAmountInput } from 'src/form/form-asset-amount-input/form-asset-amount-input';
import { FormCheckbox } from 'src/form/form-checkbox';
import { FormTextInput } from 'src/form/form-text-input';
import { useAddressFieldAnalytics } from 'src/hooks/use-address-field-analytics.hook';
import { useCanUseOnRamp } from 'src/hooks/use-can-use-on-ramp.hook';
import { useFilteredAssetsList } from 'src/hooks/use-filtered-assets-list.hook';
import { useFilteredReceiversList } from 'src/hooks/use-filtered-receivers-list.hook';
import { useOnRampContinueOverlay } from 'src/hooks/use-on-ramp-continue-overlay.hook';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useModalParams } from 'src/navigator/hooks/use-navigation.hook';
import { OnRampOverlay } from 'src/screens/wallet/on-ramp-overlay/on-ramp-overlay';
import { addContactCandidateAddressAction } from 'src/store/contact-book/contact-book-actions';
import { useShieldedBalanceSelector } from 'src/store/sapling';
import { prepareSaplingTransactionActions } from 'src/store/sapling/sapling-actions';
import { setOnRampOverlayStateAction } from 'src/store/settings/settings-actions';
import { useAssetExchangeRate, useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { sendAssetActions } from 'src/store/wallet/wallet-actions';
import { useCurrentAccountTezosBalance } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { showWarningToast, showErrorToast } from 'src/toast/toast.utils';
import { TEZ_TOKEN_SLUG, TEZ_SHIELDED_TOKEN_SLUG, TEZ_SHIELDED_TOKEN_METADATA } from 'src/token/data/tokens-metadata';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { useCurrentAccountCollectibles, useCurrentAccountTokens } from 'src/utils/assets/hooks';
import { isTezosDomainNameValid, tezosDomainsResolver } from 'src/utils/dns.utils';
import { isDefined } from 'src/utils/is-defined';
import { isSaplingAddress } from 'src/utils/sapling/address-utils';
import { isValidAddress } from 'src/utils/tezos.util';
import { useTezosTokenOfCurrentAccount } from 'src/utils/wallet.utils';

import { SendModalFormValues, sendModalValidationSchema } from './send-modal.form';
import { SendModalSelectors } from './send-modal.selectors';
import { useSendModalStyles } from './send-modal.styles';

const isShieldedTezSelected = (asset: TokenInterface): boolean => getTokenSlug(asset) === TEZ_SHIELDED_TOKEN_SLUG;

export const SendModal: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { token: initialToken, receiverPublicKeyHash: initialRecieverPublicKeyHash = '' } =
    useModalParams<ModalsEnum.Send>();
  const styles = useSendModalStyles();
  const { goBack } = useNavigation();

  const tokens = useCurrentAccountTokens(true);
  const collectibles = useCurrentAccountCollectibles(true);
  const tezosToken = useTezosTokenOfCurrentAccount();
  const canUseOnRamp = useCanUseOnRamp();
  const tezosBalance = useCurrentAccountTezosBalance();
  const { isOpened: onRampOverlayIsOpened, onClose: onOnRampOverlayClose } = useOnRampContinueOverlay();

  const shieldedBalanceMutez = useShieldedBalanceSelector();

  const shieldedExchangeRate = useAssetExchangeRate(TEZ_SHIELDED_TOKEN_SLUG);

  const shieldedTezToken: TokenInterface | undefined = useMemo(() => {
    if (shieldedBalanceMutez === '0') {
      return undefined;
    }

    return {
      ...TEZ_SHIELDED_TOKEN_METADATA,
      balance: shieldedBalanceMutez,
      exchangeRate: shieldedExchangeRate,
      visibility: VisibilityEnum.Visible
    };
  }, [shieldedBalanceMutez, shieldedExchangeRate]);

  const assets = useMemo(() => {
    const base = tokens.concat(collectibles);

    return shieldedTezToken ? [shieldedTezToken, ...base] : base;
  }, [tokens, collectibles, shieldedTezToken]);

  const leadingAssets = useMemo(
    () => (shieldedTezToken ? [tezosToken, shieldedTezToken] : [tezosToken]),
    [tezosToken, shieldedTezToken]
  );

  const { filteredAssetsList, setSearchValue } = useFilteredAssetsList(assets, true, true, leadingAssets);
  const { filteredReceiversList, handleSearchValueChange } = useFilteredReceiversList();

  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const resolver = useMemo(() => tezosDomainsResolver(selectedRpcUrl), [selectedRpcUrl]);

  const isTransferDisabled = filteredReceiversList.length === 0;
  const recipient = filteredReceiversList[0]?.data[0];

  const inputInitialValue = useMemo(
    () => assets.find(item => tokenEqualityFn(item, initialToken)) ?? tezosToken,
    [assets, initialToken, tezosToken]
  );

  const sendModalInitialValues = useMemo<SendModalFormValues>(
    () => ({
      assetAmount: {
        asset: inputInitialValue,
        amount: undefined
      },
      receiverPublicKeyHash: initialRecieverPublicKeyHash,
      recipient,
      transferBetweenOwnAccounts: false,
      memo: ''
    }),
    []
  );

  const onSubmit = useCallback(
    async ({
      assetAmount: { asset, amount },
      receiverPublicKeyHash,
      recipient,
      transferBetweenOwnAccounts,
      memo
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

      const resolvedAddress = transferBetweenOwnAccounts ? recipient.publicKeyHash : receiverPublicKeyHash;
      const isRecipientSapling = isSaplingAddress(resolvedAddress);
      const isSourceShielded = isShieldedTezSelected(asset);

      // Sapling flow
      if (isSourceShielded || (getTokenSlug(asset) === TEZ_TOKEN_SLUG && isRecipientSapling)) {
        if (!isDefined(amount)) {
          return;
        }

        const amountMutez = amount.toFixed(0);

        if (isSourceShielded && isRecipientSapling) {
          // sapling transfer
          dispatch(
            prepareSaplingTransactionActions.submit({
              type: 'transfer',
              amount: amountMutez,
              recipientAddress: resolvedAddress,
              memo: memo || undefined
            })
          );
        } else if (isSourceShielded) {
          // shielded - public (unshield)
          dispatch(
            prepareSaplingTransactionActions.submit({
              type: 'unshield',
              amount: amountMutez,
              recipientAddress: resolvedAddress
            })
          );
        } else {
          // public - shielded (shield)
          dispatch(
            prepareSaplingTransactionActions.submit({
              type: 'shield',
              amount: amountMutez,
              recipientAddress: resolvedAddress,
              memo: memo || undefined
            })
          );
        }

        return;
      }

      // Regular flow
      !transferBetweenOwnAccounts && dispatch(addContactCandidateAddressAction(receiverPublicKeyHash));

      if (getTokenSlug(asset) === TEZ_TOKEN_SLUG && (amount?.isGreaterThan(tezosBalance) ?? false) && canUseOnRamp) {
        dispatch(setOnRampOverlayStateAction(OnRampOverlayState.Continue));
      } else if (isDefined(amount)) {
        dispatch(
          sendAssetActions.submit({
            asset,
            receiverPublicKeyHash: resolvedAddress,
            amount: amount.toString()
          })
        );
      }
    },
    [dispatch, tezosBalance, canUseOnRamp, resolver]
  );

  const formik = useFormik({
    initialValues: sendModalInitialValues,
    validationSchema: sendModalValidationSchema,
    onSubmit
  });

  const { errors, values, submitForm } = formik;

  const selectedAssetSlug = getTokenSlug(values.assetAmount.asset);
  const isTezOrShieldedTez = selectedAssetSlug === TEZ_TOKEN_SLUG || selectedAssetSlug === TEZ_SHIELDED_TOKEN_SLUG;
  const isRecipientSapling = isSaplingAddress(values.receiverPublicKeyHash);
  const showMemoField = isTezOrShieldedTez && isRecipientSapling;

  usePageAnalytic(ModalsEnum.Send);
  const { onBlur: handleAddressInputBlur } = useAddressFieldAnalytics(
    'RECIPIENT_NETWORK',
    'receiverPublicKeyHash' as const,
    formik
  );

  return (
    <FormikProvider value={formik}>
      <ScreenContainer>
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
            description={
              isTezOrShieldedTez
                ? `Address, zet1, or Tezos domain to send ${values.assetAmount.asset.symbol} funds to.`
                : `Address or Tezos domain to send ${values.assetAmount.asset.symbol} funds to.`
            }
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
              placeholder={isTezOrShieldedTez ? 'e.g. tz1, zet1, or domain' : 'e.g. address'}
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
              disabled={isTransferDisabled || isRecipientSapling}
              name="transferBetweenOwnAccounts"
              size={formatSize(16)}
              testID={SendModalSelectors.transferBetweenMyAccountsCheckBox}
            >
              <Text style={styles.checkboxText}>Transfer between my accounts or contacts</Text>
            </FormCheckbox>
          </View>

          {showMemoField && (
            <>
              <Divider size={formatSize(8)} />
              <Label label="Memo" description="Optional" />
              <FormTextInput name="memo" placeholder="Max 8 symbols" testID={SendModalSelectors.memoInput} />
            </>
          )}

          <Divider />
        </View>
      </ScreenContainer>
      <ModalButtonsFloatingContainer>
        <ButtonLargeSecondary
          title="Close"
          onPress={goBack}
          disabled={isLoading}
          testID={SendModalSelectors.closeButton}
        />
        <ButtonLargePrimary
          title="Send"
          onPress={submitForm}
          disabled={isLoading || Object.keys(errors).length > 0}
          testID={SendModalSelectors.sendButton}
        />
      </ModalButtonsFloatingContainer>
      <OnRampOverlay isStart={false} onClose={onOnRampOverlayClose} isOpen={onRampOverlayIsOpened} />
    </FormikProvider>
  );
};
