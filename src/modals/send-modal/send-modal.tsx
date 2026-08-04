import { useNavigation } from '@react-navigation/core';
import { FormikProvider, useFormik } from 'formik';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { ContactFormSectionDropdown } from 'src/components/contact-dropdown/contact-form-section-dropdown';
import { CryptoLogo } from 'src/components/crypto-logo';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { Divider } from 'src/components/divider/divider';
import { IconV2 } from 'src/components/icon-v2';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum.ts';
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
import { useFilteredReceiversList } from 'src/hooks/use-filtered-receivers-list.hook';
import { useOnRampContinueOverlay } from 'src/hooks/use-on-ramp-continue-overlay.hook';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useModalParams } from 'src/navigator/hooks/use-navigation.hook';
import { OnRampOverlay } from 'src/screens/wallet/on-ramp-overlay/on-ramp-overlay';
import { dispatch } from 'src/store';
import { useSaplingAddressSelector } from 'src/store/sapling';
import { setOnRampOverlayStateAction } from 'src/store/settings/settings-actions';
import {
  useAccountAddressForEvm,
  useAccountAddressForTezos,
  useCurrentAccountId,
  useCurrentAccountTezosBalance
} from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { TEZ_SHIELDED_ANALYTICS_NAME, TEZ_SHIELDED_TOKEN_SLUG, TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';
import { isTezosSendAsset } from 'src/types/send-asset';
import { AnalyticsPageName } from 'src/utils/analytics/analytics-event.enum';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { isSaplingAddress } from 'src/utils/sapling/address-utils';

import { SendAssetAmount, SendModalFormValues, sendModalValidationSchema } from './send-modal.form';
import { SendModalSelectors } from './send-modal.selectors';
import { useSendModalStyles } from './send-modal.styles';
import { useEvmMaxAmount } from './use-evm-max-amount.hook';
import { useSendAssets } from './use-send-assets.hook';
import { useSendSubmission } from './use-send-submission.hook';

type NetworkFilter = 'all' | TempleChainKind;

const NETWORK_FILTERS: Array<{ label: string; value: NetworkFilter }> = [
  { label: 'All', value: 'all' },
  { label: 'Tezos', value: TempleChainKind.Tezos },
  { label: 'Etherlink', value: TempleChainKind.EVM }
];

export const SendModal: FC = () => {
  const [assetSearch, setAssetSearch] = useState('');
  const [networkFilter, setNetworkFilter] = useState<NetworkFilter>('all');
  const {
    token: initialToken,
    receiverPublicKeyHash: initialReceiverAddress = '',
    assetKey: initialAssetKey
  } = useModalParams<ModalsEnum.Send>();
  const styles = useSendModalStyles();
  const colors = useColors();
  const { goBack } = useNavigation();

  const assets = useSendAssets();
  const tezosBalance = useCurrentAccountTezosBalance();
  const tezosAddress = useAccountAddressForTezos();
  const evmAddress = useAccountAddressForEvm();
  const saplingAddress = useSaplingAddressSelector();
  const accountId = useCurrentAccountId();
  const { isOpened: onRampOverlayIsOpened, onClose: onOnRampOverlayClose } = useOnRampContinueOverlay();
  const { isLoading, submit: onSubmit } = useSendSubmission({
    accountId,
    evmAddress,
    tezosAddress,
    tezosBalance
  });

  const inputInitialValue = useMemo(
    () =>
      assets.find(item => item.assetKey === initialAssetKey) ??
      assets.find(item => isTezosSendAsset(item) && tokenEqualityFn(item, initialToken)) ??
      assets.find(item => item.assetSlug === TEZ_TOKEN_SLUG) ??
      assets[0],
    [assets, initialAssetKey, initialToken]
  );

  const sendModalInitialValues: SendModalFormValues = {
    assetAmount: {
      asset: inputInitialValue,
      amount: undefined
    },
    recipient: initialReceiverAddress,
    transferBetweenOwnAccounts: false,
    memo: ''
  };

  const formik = useFormik({
    initialValues: sendModalInitialValues,
    validationSchema: sendModalValidationSchema,
    validateOnChange: true,
    validateOnBlur: false,
    validateOnMount: false,
    onSubmit
  });

  const { isValid, submitCount, isSubmitting, values, setFieldError, setFieldValue, setValues, submitForm } = formik;
  const selectedAsset = values.assetAmount.asset;
  const { maxAmount, isEstimating: isEvmMaxAmountEstimating } = useEvmMaxAmount({
    asset: selectedAsset,
    recipient: values.recipient,
    sourceAddress: evmAddress
  });
  const isShieldedSend = selectedAsset.assetSlug === TEZ_SHIELDED_TOKEN_SLUG;
  const sourceAddress = isShieldedSend
    ? saplingAddress ?? undefined
    : selectedAsset.chainKind === TempleChainKind.Tezos
    ? tezosAddress
    : evmAddress;
  const { filteredReceiversList, handleSearchValueChange } = useFilteredReceiversList(
    selectedAsset.chainKind,
    sourceAddress,
    isShieldedSend
  );

  const filteredAssets = useMemo(() => {
    const normalizedSearch = assetSearch.trim().toLowerCase();

    return assets.filter(
      asset =>
        (networkFilter === 'all' || asset.chainKind === networkFilter) &&
        (!normalizedSearch ||
          asset.name.toLowerCase().includes(normalizedSearch) ||
          asset.symbol.toLowerCase().includes(normalizedSearch) ||
          (asset.chainKind === TempleChainKind.EVM &&
            asset.sendStandard !== EvmAssetStandardEnum.NATIVE &&
            asset.contractAddress.toLowerCase().includes(normalizedSearch)))
    );
  }, [assetSearch, assets, networkFilter]);

  const handleAssetAmountChange = useCallback(
    (nextValue: SendAssetAmount) => {
      if (nextValue.asset.assetKey !== selectedAsset.assetKey) {
        void setValues(currentValues => ({
          ...currentValues,
          recipient: '',
          transferBetweenOwnAccounts: false
        }));
      }
    },
    [selectedAsset.assetKey, setValues]
  );

  const isTransferDisabled = filteredReceiversList.length === 0;
  const firstReceiver = useMemo(() => filteredReceiversList.flatMap(({ data }) => data)[0], [filteredReceiversList]);
  const isTezOrShieldedTez =
    selectedAsset.assetSlug === TEZ_TOKEN_SLUG || selectedAsset.assetSlug === TEZ_SHIELDED_TOKEN_SLUG;
  const isRecipientSapling = isSaplingAddress(values.recipient);
  const showMemoField = selectedAsset.chainKind === TempleChainKind.Tezos && isTezOrShieldedTez && isRecipientSapling;

  const handleTransferBetweenOwnAccountsChange = useCallback(
    (isEnabled: boolean) => {
      if (isEnabled && firstReceiver) {
        void setFieldValue('recipient', firstReceiver.address);
        setFieldError('recipient', undefined);
      } else if (!isEnabled) {
        void setFieldValue('recipient', '');
      }
    },
    [firstReceiver, setFieldError, setFieldValue]
  );

  useEffect(() => {
    if (
      selectedAsset.chainKind === TempleChainKind.Tezos &&
      selectedAsset.assetSlug === TEZ_TOKEN_SLUG &&
      selectedAsset.balance === '0' &&
      !LIMIT_FIN_FEATURES
    ) {
      dispatch(setOnRampOverlayStateAction(OnRampOverlayState.Continue));
    }
  }, [selectedAsset.assetKey, selectedAsset.assetSlug, selectedAsset.balance, selectedAsset.chainKind]);

  const sendPageName = isShieldedSend ? AnalyticsPageName.SendShieldedTez : ModalsEnum.Send;
  const sendPageToken = isShieldedSend ? TEZ_SHIELDED_ANALYTICS_NAME : selectedAsset.symbol;
  usePageAnalytic(sendPageName, '', { token: sendPageToken });

  const tokenFilterHeader = (
    <View style={styles.filterRow}>
      {NETWORK_FILTERS.map(filter => (
        <TouchableOpacity
          key={filter.value}
          style={[styles.filterChip, networkFilter === filter.value && styles.filterChipSelected]}
          onPress={() => setNetworkFilter(filter.value)}
        >
          <View style={styles.filterIconContainer}>
            {filter.value === 'all' ? (
              <IconV2 name={IconNameV2Enum.Earth} color={colors.blue} />
            ) : (
              <CryptoLogo
                name={filter.value === TempleChainKind.Tezos ? CryptoLogoNameEnum.Tezos : CryptoLogoNameEnum.Etherlink}
                size={formatSize(20)}
              />
            )}
          </View>
          <Divider size={formatSize(4)} />
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
            variant="v2"
            maxButton
            maxAmount={maxAmount}
            maxButtonDisabled={isEvmMaxAmountEstimating}
            showErrorInFooter
            name="assetAmount"
            label="Asset"
            assetsList={filteredAssets}
            isSearchable
            dropdownDescription="Select Token"
            searchPlaceholder="Search by name or address"
            dropdownListHeader={tokenFilterHeader}
            setSearchValue={setAssetSearch}
            onValueChange={handleAssetAmountChange}
            testID={SendModalSelectors.assetInput}
            tokenTestID={SendModalSelectors.tokenChange}
            maxButtonTestID={SendModalSelectors.maxButton}
            switcherTestID={SendModalSelectors.switcherButton}
          />
          <Divider />

          <Label label="Recipient" description="Address or domain to send funds to" />
          {values.transferBetweenOwnAccounts ? (
            <ContactFormSectionDropdown
              name="recipient"
              list={filteredReceiversList}
              chainKind={selectedAsset.chainKind}
              isShieldedTez={isShieldedSend}
              setSearchValue={handleSearchValueChange}
              testID={SendModalSelectors.sectionDropdown}
            />
          ) : (
            <FormAddressInput
              name="recipient"
              placeholder={selectedAsset.chainKind === TempleChainKind.Tezos ? 'Address or domain' : 'Address'}
              testID={SendModalSelectors.toInput}
              pasteButtonTestID={SendModalSelectors.pasteAddressButton}
              inputStyle={styles.recipientInput}
            />
          )}

          {!isTransferDisabled && (
            <FormCheckbox
              disabled={isRecipientSapling}
              name="transferBetweenOwnAccounts"
              onValueChange={handleTransferBetweenOwnAccountsChange}
              shouldValidate={false}
              size={16}
              testID={SendModalSelectors.transferBetweenMyAccountsCheckBox}
            >
              <Text style={styles.checkboxText}>Transfer between my accounts</Text>
            </FormCheckbox>
          )}

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
      <ModalButtonsFloatingContainer variant="bordered">
        <ButtonLargeSecondary
          title="Cancel"
          onPress={goBack}
          disabled={isLoading}
          testID={SendModalSelectors.closeButton}
        />
        <ButtonLargePrimary
          title="Confirm"
          onPress={submitForm}
          isLoading={isLoading}
          disabled={(submitCount !== 0 && !isValid) || isSubmitting}
          testID={SendModalSelectors.sendButton}
        />
      </ModalButtonsFloatingContainer>
      <OnRampOverlay isStart={false} onClose={onOnRampOverlayClose} isOpen={onRampOverlayIsOpened} />
    </FormikProvider>
  );
};
