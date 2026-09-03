import { Formik, FormikProps } from 'formik';
import React, { FC, useCallback, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { isAddress } from 'viem';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from 'src/components/divider/divider';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { FormAddressInput } from 'src/form/form-address-input';
import { FormNumericInput } from 'src/form/form-numeric-input/form-numeric-input';
import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { useEvmAccountChainAssetsSelector } from 'src/store/evm/assets/evm-assets-selectors';
import { loadTokenSuggestionActions } from 'src/store/tokens-metadata/tokens-metadata-actions';
import { useAccountAddressForEvm, useCurrentAccountStoredAssetsListSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast, showWarningToast } from 'src/toast/toast.utils';
import { getTokenSlug, isValidTokenContract } from 'src/token/utils/token.utils';
import { toEvmNetworkEssentials } from 'src/types/networks';
import { resolveErc20Token, resolveEvmCollectible } from 'src/utils/evm/resolve-evm-asset';
import { toEvmAssetSlug } from 'src/utils/from-token-slug';
import { useWillUnmount } from 'src/utils/hooks/use-will-unmount';
import { isDefined } from 'src/utils/is-defined';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { useAddAssetModalStyles } from '../styles';
import { genericErrorMessage, EvmAssetSuggestion } from '../types';

import {
  addTokenAddressFormInitialValues,
  getAddTokenAddressFormValidationSchema,
  AddTokenAddressFormValues
} from './add-asset-address.form';
import { AddAssetAddressSelectors } from './add-asset-address.selectors';
import { NetworkSelect } from './network-select';

interface Props {
  network: TempleChainKind;
  onNetworkSelect: SyncFn<TempleChainKind>;
  onCloseButtonPress: EmptyFn;
  onFormSubmitted: (evmSuggestion?: EvmAssetSuggestion) => void;
}

const duplicateTokenErrorMessage = 'Token with this address already added to this account.';
const duplicateNftErrorMessage = 'This NFT is already added to this account.';
const invalidTokenAddressErrorMessage = 'Invalid token address';
const nftWithoutIdErrorMessage = 'This is an NFT — enter its Token ID';
const erc20WithIdErrorMessage = 'This is a token contract — remove the Token ID to add it';
const nftNotFoundErrorMessage = 'NFT not found';
const noEvmAccountErrorMessage = 'Etherlink is not available for the current account';

export const AddAssetAddress: FC<Props> = ({ network, onNetworkSelect, onCloseButtonPress, onFormSubmitted }) => {
  const styles = useAddAssetModalStyles();
  const dispatch = useDispatch();
  const tezos = useReadOnlyTezosToolkit();

  const assets = useCurrentAccountStoredAssetsListSelector();

  const evmAccount = useAccountAddressForEvm();
  const evmAssets = useEvmAccountChainAssetsSelector(evmAccount, ETHERLINK_MAINNET_CHAIN_ID);
  const etherlinkChain = useEvmChain(ETHERLINK_MAINNET_CHAIN_ID);

  const isTezos = network === TempleChainKind.Tezos;

  const validationSchema = getAddTokenAddressFormValidationSchema(network);

  const formikRef = useRef<FormikProps<AddTokenAddressFormValues>>(null);
  const isInitialNetworkRef = useRef(true);
  const isUnmountedRef = useRef(false);

  useWillUnmount(() => {
    isUnmountedRef.current = true;
  });

  useEffect(() => {
    if (isInitialNetworkRef.current) {
      isInitialNetworkRef.current = false;

      return;
    }

    const formik = formikRef.current;

    if (!formik) {
      return;
    }

    if (formik.values.address !== '') {
      formik.setFieldTouched('address', true, false);
    }

    void formik.validateForm();
  }, [network]);

  const handleNetworkSelect = useCallback(
    (chainKind: TempleChainKind) => {
      if (chainKind === TempleChainKind.EVM && !isDefined(evmAccount)) {
        return void showWarningToast({ description: noEvmAccountErrorMessage });
      }

      onNetworkSelect(chainKind);
    },
    [evmAccount, onNetworkSelect]
  );

  const onTezosSubmit = ({ id, address }: AddTokenAddressFormValues) => {
    const token = { address, id: id?.toNumber() ?? 0 };
    const slug = getTokenSlug(token);

    return tezos.contract
      .at(address)
      .then(contract => {
        if (isUnmountedRef.current) {
          return;
        }

        if (!isValidTokenContract(contract)) {
          showErrorToast({ description: invalidTokenAddressErrorMessage });
        } else if (assets?.some(item => item.slug === slug)) {
          showErrorToast({ description: duplicateTokenErrorMessage });
        } else {
          dispatch(loadTokenSuggestionActions.submit(token));
          onFormSubmitted();
        }
      })
      .catch(() => {
        if (!isUnmountedRef.current) {
          showWarningToast({ description: genericErrorMessage });
        }
      });
  };

  const onEvmSubmit = async ({ address, id }: AddTokenAddressFormValues) => {
    if (!isDefined(evmAccount)) {
      return void showWarningToast({ description: noEvmAccountErrorMessage });
    }

    if (!isAddress(address)) {
      return void showErrorToast({ description: invalidTokenAddressErrorMessage });
    }

    const evmNetwork = etherlinkChain && toEvmNetworkEssentials(etherlinkChain);

    if (!evmNetwork) {
      return void showWarningToast({ description: genericErrorMessage });
    }

    const tokenId = id?.toFixed();
    const slug = toEvmAssetSlug(address, tokenId);
    const storedAsset = evmAssets[slug];

    if (isDefined(storedAsset) && storedAsset.visibility !== VisibilityEnum.Hidden) {
      return void showErrorToast({
        description: isDefined(tokenId) ? duplicateNftErrorMessage : duplicateTokenErrorMessage
      });
    }

    try {
      const result = isDefined(tokenId)
        ? await resolveEvmCollectible(evmNetwork, address, tokenId)
        : await resolveErc20Token(evmNetwork, address);

      if (isUnmountedRef.current) {
        return;
      }

      switch (result.type) {
        case 'erc20':
        case 'collectible':
          return onFormSubmitted(result);
        case 'erc20-with-id':
          return void showErrorToast({ description: erc20WithIdErrorMessage });
        case 'not-erc20':
          return void showErrorToast({ description: nftWithoutIdErrorMessage });
        case 'unavailable':
          return void showWarningToast({ description: genericErrorMessage });
        case 'not-found':
          return void showErrorToast({
            description: isDefined(tokenId) ? nftNotFoundErrorMessage : invalidTokenAddressErrorMessage
          });
      }
    } catch {
      if (!isUnmountedRef.current) {
        showWarningToast({ description: genericErrorMessage });
      }
    }
  };

  return (
    <Formik
      innerRef={formikRef}
      initialValues={addTokenAddressFormInitialValues}
      validationSchema={validationSchema}
      onSubmit={values => (isTezos ? onTezosSubmit(values) : onEvmSubmit(values))}
    >
      {({ isValid, isSubmitting, submitForm }) => (
        <>
          <ScreenContainer isFullScreenMode={true}>
            <View>
              <Label label="Network" />
              <NetworkSelect
                selected={network}
                disabled={isSubmitting}
                onSelect={handleNetworkSelect}
                testID={AddAssetAddressSelectors.networkOption}
              />

              <Label label="Address" description="Address of deployed token contract" />
              <FormAddressInput
                name="address"
                placeholder={isTezos ? 'KT1v9CmPy…' : '0x0f5d2fb2…'}
                inputStyle={styles.input}
                testID={AddAssetAddressSelectors.addressInput}
              />

              <Divider size={formatSize(16)} />

              <Label label="Token ID" isOptional={true} />
              <FormNumericInput
                name="id"
                decimals={0}
                placeholder="0"
                style={styles.input}
                testID={AddAssetAddressSelectors.tokenIdInput}
              />

              <Divider />
            </View>
          </ScreenContainer>
          <ModalButtonsFloatingContainer variant="bordered">
            <ButtonLargeSecondary
              title="Close"
              onPress={onCloseButtonPress}
              testID={AddAssetAddressSelectors.closeButton}
            />
            <ButtonLargePrimary
              title="Next"
              disabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
              onPress={submitForm}
              testID={AddAssetAddressSelectors.nextButton}
            />
          </ModalButtonsFloatingContainer>
        </>
      )}
    </Formik>
  );
};
