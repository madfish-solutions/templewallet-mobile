import { useNavigation } from '@react-navigation/core';
import { FormikProvider, useFormik } from 'formik';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { ContactFormSectionDropdown } from 'src/components/contact-dropdown/contact-form-section-dropdown';
import { Divider } from 'src/components/divider/divider';
import { Label } from 'src/components/label/label';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { tokenEqualityFn } from 'src/components/token-dropdown/token-equality-fn';
import { LIMIT_FIN_FEATURES } from 'src/config/system';
import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { FormAddressInput } from 'src/form/form-address-input';
import { FormAssetAmountInput } from 'src/form/form-asset-amount-input/form-asset-amount-input';
import { FormCheckbox } from 'src/form/form-checkbox';
import { FormTextInput } from 'src/form/form-text-input';
import { useAddressFieldAnalytics } from 'src/hooks/use-address-field-analytics.hook';
import { useFilteredReceiversList } from 'src/hooks/use-filtered-receivers-list.hook';
import { useOnRampContinueOverlay } from 'src/hooks/use-on-ramp-continue-overlay.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useModalParams, useNavigateToModal } from 'src/navigator/hooks/use-navigation.hook';
import { OnRampOverlay } from 'src/screens/wallet/on-ramp-overlay/on-ramp-overlay';
import { addContactCandidateAddressAction } from 'src/store/contact-book/contact-book-actions';
import { prepareSaplingTransactionActions } from 'src/store/sapling/sapling-actions';
import { setOnRampOverlayStateAction } from 'src/store/settings/settings-actions';
import { sendAssetActions } from 'src/store/wallet/wallet-actions';
import {
  useAccountAddressForEvm,
  useAccountAddressForTezos,
  useCurrentAccountId,
  useCurrentAccountTezosBalance
} from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast, showWarningToast } from 'src/toast/toast.utils';
import { TEZ_SHIELDED_ANALYTICS_NAME, TEZ_SHIELDED_TOKEN_SLUG, TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { AnalyticsPageName } from 'src/utils/analytics/analytics-event.enum';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { isTezosDomainNameValid, tezosDomainsResolver } from 'src/utils/dns.utils';
import { isDefined } from 'src/utils/is-defined';
import { isSaplingAddress } from 'src/utils/sapling/address-utils';

import { SendAssetAmount, SendModalFormValues, sendModalValidationSchema } from './send-modal.form';
import { SendModalSelectors } from './send-modal.selectors';
import { useSendModalStyles } from './send-modal.styles';
import { useSendAssets } from './use-send-assets.hook';

type NetworkFilter = 'all' | TempleChainKind;

const NETWORK_FILTERS: Array<{ label: string; value: NetworkFilter }> = [
  { label: 'All', value: 'all' },
  { label: 'Tezos', value: TempleChainKind.Tezos },
  { label: 'Etherlink', value: TempleChainKind.EVM }
];

export const SendModal: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [assetSearch, setAssetSearch] = useState('');
  const [networkFilter, setNetworkFilter] = useState<NetworkFilter>('all');
  const dispatch = useDispatch();
  const navigateToModal = useNavigateToModal();
  const { token: initialToken, receiverPublicKeyHash: initialReceiverPublicKeyHash = '' } =
    useModalParams<ModalsEnum.Send>();
  const styles = useSendModalStyles();
  const { goBack } = useNavigation();

  const assets = useSendAssets();
  const tezosBalance = useCurrentAccountTezosBalance();
  const tezosAddress = useAccountAddressForTezos();
  const evmAddress = useAccountAddressForEvm();
  const accountId = useCurrentAccountId();
  const { isOpened: onRampOverlayIsOpened, onClose: onOnRampOverlayClose } = useOnRampContinueOverlay();

  const inputInitialValue = useMemo(
    () =>
      assets.find(item => item.chainKind === TempleChainKind.Tezos && tokenEqualityFn(item, initialToken)) ??
      assets.find(item => item.assetSlug === TEZ_TOKEN_SLUG) ??
      assets[0],
    [assets, initialToken]
  );

  const sendModalInitialValues: SendModalFormValues = {
    assetAmount: {
      asset: inputInitialValue,
      amount: undefined
    },
    receiverPublicKeyHash: initialReceiverPublicKeyHash,
    recipient: undefined,
    transferBetweenOwnAccounts: false,
    memo: ''
  };

  const resolver = useMemo(() => tezosDomainsResolver(), []);

  const onSubmit = useCallback(
    async ({
      assetAmount: { asset, amount },
      receiverPublicKeyHash,
      recipient,
      transferBetweenOwnAccounts,
      memo
    }: SendModalFormValues) => {
      if (!isDefined(amount)) {
        return;
      }

      let resolvedAddress = transferBetweenOwnAccounts ? recipient?.address ?? '' : receiverPublicKeyHash;

      if (
        asset.chainKind === TempleChainKind.Tezos &&
        !transferBetweenOwnAccounts &&
        isTezosDomainNameValid(receiverPublicKeyHash)
      ) {
        setIsLoading(true);
        const address = await resolver.resolveNameToAddress(receiverPublicKeyHash).catch(() => null);
        setIsLoading(false);

        if (!address) {
          showErrorToast({ title: 'Error!', description: 'Unable to resolve this Tezos domain' });

          return;
        }
        resolvedAddress = address;
      }

      if (!transferBetweenOwnAccounts) {
        dispatch(addContactCandidateAddressAction(resolvedAddress));
      }

      if (asset.chainKind === TempleChainKind.EVM) {
        if (!evmAddress || !accountId) {
          showErrorToast({ description: 'Select an Etherlink account to send assets' });

          return;
        }

        navigateToModal(ModalsEnum.Confirmation, {
          type: ConfirmationTypeEnum.EvmTransfer,
          accountId,
          asset,
          receiverAddress: resolvedAddress as HexString,
          atomicAmount: amount.toFixed(0)
        });

        return;
      }

      if (!tezosAddress) {
        showErrorToast({ description: 'Select a Tezos account to send assets' });

        return;
      }

      const isRecipientSapling = isSaplingAddress(resolvedAddress);
      const isSourceShielded = asset.assetSlug === TEZ_SHIELDED_TOKEN_SLUG;

      if (isSourceShielded || (asset.assetSlug === TEZ_TOKEN_SLUG && isRecipientSapling)) {
        const amountMutez = amount.toFixed(0);

        if (isSourceShielded && isRecipientSapling) {
          dispatch(
            prepareSaplingTransactionActions.submit({
              type: 'transfer',
              amount: amountMutez,
              recipientAddress: resolvedAddress,
              memo: memo || undefined
            })
          );
        } else if (isSourceShielded) {
          dispatch(
            prepareSaplingTransactionActions.submit({
              type: 'unshield',
              amount: amountMutez,
              recipientAddress: resolvedAddress
            })
          );
        } else {
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

      if (asset.assetSlug === TEZ_TOKEN_SLUG && amount.isGreaterThan(tezosBalance) && !LIMIT_FIN_FEATURES) {
        dispatch(setOnRampOverlayStateAction(OnRampOverlayState.Continue));
      } else {
        dispatch(
          sendAssetActions.submit({
            asset,
            receiverPublicKeyHash: resolvedAddress,
            amount: amount.toString()
          })
        );
      }
    },
    [accountId, dispatch, evmAddress, navigateToModal, resolver, tezosAddress, tezosBalance]
  );

  const formik = useFormik({
    initialValues: sendModalInitialValues,
    validationSchema: sendModalValidationSchema,
    validateOnChange: true,
    validateOnBlur: false,
    validateOnMount: false,
    onSubmit
  });

  const { errors, values, setFieldValue, submitForm } = formik;
  const selectedAsset = values.assetAmount.asset;
  const sourceAddress = selectedAsset.chainKind === TempleChainKind.Tezos ? tezosAddress : evmAddress;
  const { filteredReceiversList, handleSearchValueChange } = useFilteredReceiversList(
    selectedAsset.chainKind,
    sourceAddress
  );

  const filteredAssets = useMemo(() => {
    const normalizedSearch = assetSearch.trim().toLowerCase();

    return assets.filter(
      asset =>
        (networkFilter === 'all' || asset.chainKind === networkFilter) &&
        (!normalizedSearch ||
          asset.name.toLowerCase().includes(normalizedSearch) ||
          asset.symbol.toLowerCase().includes(normalizedSearch) ||
          asset.contractAddress?.toLowerCase().includes(normalizedSearch))
    );
  }, [assetSearch, assets, networkFilter]);

  const handleAssetAmountChange = useCallback(
    (nextValue: SendAssetAmount) => {
      if (nextValue.asset.assetKey !== selectedAsset.assetKey) {
        void setFieldValue('receiverPublicKeyHash', '');
        void setFieldValue('recipient', undefined);
        void setFieldValue('transferBetweenOwnAccounts', false);
      }
    },
    [selectedAsset.assetKey, setFieldValue]
  );

  const isTransferDisabled = filteredReceiversList.length === 0;
  const isTezOrShieldedTez =
    selectedAsset.assetSlug === TEZ_TOKEN_SLUG || selectedAsset.assetSlug === TEZ_SHIELDED_TOKEN_SLUG;
  const isShieldedSend = selectedAsset.assetSlug === TEZ_SHIELDED_TOKEN_SLUG;
  const isRecipientSapling = isSaplingAddress(values.receiverPublicKeyHash);
  const showMemoField = selectedAsset.chainKind === TempleChainKind.Tezos && isTezOrShieldedTez && isRecipientSapling;
  const hasSourceAccount =
    selectedAsset.chainKind === TempleChainKind.Tezos ? Boolean(tezosAddress) : Boolean(evmAddress);

  useEffect(() => {
    if (
      selectedAsset.chainKind === TempleChainKind.Tezos &&
      selectedAsset.assetSlug === TEZ_TOKEN_SLUG &&
      selectedAsset.balance === '0' &&
      !LIMIT_FIN_FEATURES
    ) {
      dispatch(setOnRampOverlayStateAction(OnRampOverlayState.Continue));
    }
  }, [dispatch, selectedAsset.assetKey, selectedAsset.assetSlug, selectedAsset.balance, selectedAsset.chainKind]);

  const sendPageName = isShieldedSend ? AnalyticsPageName.SendShieldedTez : ModalsEnum.Send;
  const sendPageToken = isShieldedSend ? TEZ_SHIELDED_ANALYTICS_NAME : selectedAsset.symbol;
  usePageAnalytic(sendPageName, '', { token: sendPageToken });
  const { onBlur: handleAddressInputBlur } = useAddressFieldAnalytics(
    'RECIPIENT_NETWORK',
    'receiverPublicKeyHash' as const,
    formik
  );

  const tokenFilterHeader = (
    <View style={styles.filterRow}>
      {NETWORK_FILTERS.map(filter => (
        <TouchableOpacity
          key={filter.value}
          style={[styles.filterChip, networkFilter === filter.value && styles.filterChipSelected]}
          onPress={() => setNetworkFilter(filter.value)}
        >
          <Text style={[styles.filterChipText, networkFilter === filter.value && styles.filterChipTextSelected]}>
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
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
            assetsList={filteredAssets}
            isSearchable
            dropdownDescription="Select Token"
            searchPlaceholder="Search by name or address"
            dropdownListHeader={tokenFilterHeader}
            setSearchValue={setAssetSearch}
            onValueChange={value => handleAssetAmountChange(value as SendAssetAmount)}
            testID={SendModalSelectors.assetInput}
            tokenTestID={SendModalSelectors.tokenChange}
            maxButtonTestID={SendModalSelectors.maxButton}
            switcherTestID={SendModalSelectors.switcherButton}
          />
          <Divider />

          <Label label="Recipient" description="Address or domain to send funds to" />
          {values.transferBetweenOwnAccounts ? (
            <>
              <ContactFormSectionDropdown
                name="recipient"
                list={filteredReceiversList}
                chainKind={selectedAsset.chainKind}
                setSearchValue={handleSearchValueChange}
                testID={SendModalSelectors.sectionDropdown}
              />
              <Divider size={formatSize(10)} />
            </>
          ) : (
            <FormAddressInput
              name="receiverPublicKeyHash"
              onBlur={handleAddressInputBlur}
              placeholder={selectedAsset.chainKind === TempleChainKind.Tezos ? 'e.g. tz1 or domain.tez' : 'e.g. 0x...'}
              testID={SendModalSelectors.toInput}
              pasteButtonTestID={SendModalSelectors.pasteAddressButton}
            />
          )}

          <View
            onTouchStart={() =>
              void (isTransferDisabled && showWarningToast({ description: 'Create another account or contact' }))
            }
          >
            <FormCheckbox
              disabled={isTransferDisabled || isRecipientSapling}
              name="transferBetweenOwnAccounts"
              size={formatSize(16)}
              testID={SendModalSelectors.transferBetweenMyAccountsCheckBox}
            >
              <Text style={styles.checkboxText}>Transfer between my accounts</Text>
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
          disabled={!hasSourceAccount || isLoading || Object.keys(errors).length > 0}
          testID={SendModalSelectors.sendButton}
        />
      </ModalButtonsFloatingContainer>
      <OnRampOverlay isStart={false} onClose={onOnRampOverlayClose} isOpen={onRampOverlayIsOpened} />
    </FormikProvider>
  );
};
