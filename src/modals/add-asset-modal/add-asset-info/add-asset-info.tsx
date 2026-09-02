import { BigNumber } from 'bignumber.js';
import { Formik } from 'formik';
import React, { FC, useMemo } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from 'src/components/divider/divider';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { FormNumericInput } from 'src/form/form-numeric-input/form-numeric-input';
import { FormTextInput } from 'src/form/form-text-input';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { setEvmAssetManualAction, setEvmAssetVisibilityAction } from 'src/store/evm/assets/evm-assets-actions';
import { processLoadedEvmCollectiblesMetadataAction } from 'src/store/evm/collectibles-metadata/evm-collectibles-metadata-actions';
import { processLoadedEvmExchangeRatesAction } from 'src/store/evm/exchange-rates/evm-exchange-rates-actions';
import { processLoadedEvmTokensMetadataAction } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-actions';
import { putTokenMetadataAction } from 'src/store/tokens-metadata/tokens-metadata-actions';
import { useAddTokenSuggestionSelector } from 'src/store/tokens-metadata/tokens-metadata-selectors';
import { addTokenAction } from 'src/store/wallet/wallet-actions';
import { useAccountAddressForEvm } from 'src/store/wallet/wallet-selectors';
import { showErrorToast, showSuccessToast } from 'src/toast/toast.utils';
import { EvmCollectibleMetadata, EvmTokenMetadata } from 'src/token/interfaces/token-metadata.interface';
import { toEvmAssetSlug } from 'src/utils/from-token-slug';
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { genericErrorMessage, EvmAssetSuggestion, EvmCollectibleSuggestion, EvmTokenSuggestion } from '../types';

import { addTokenInfoFormValidationSchema, AddTokenInfoFormValues } from './add-asset-info.form';
import { AddAssetInfoSelectors } from './add-asset-info.selectors';

interface Props {
  evmSuggestion?: EvmAssetSuggestion;
  onCancelButtonPress: EmptyFn;
  onFormSubmitted: EmptyFn;
}

export const AddAssetInfo: FC<Props> = ({ evmSuggestion, onCancelButtonPress, onFormSubmitted }) => {
  const dispatch = useDispatch();
  const tokenSuggestion = useAddTokenSuggestionSelector();
  const evmAccount = useAccountAddressForEvm();

  const tezosInitialValues = useMemo(
    () => ({
      ...tokenSuggestion.data,
      decimals: new BigNumber(tokenSuggestion.data.decimals)
    }),
    [tokenSuggestion.data]
  );

  const initialValues = useMemo(() => {
    if (!isDefined(evmSuggestion)) {
      return tezosInitialValues;
    }

    if (evmSuggestion.type === 'collectible') {
      return {
        symbol: evmSuggestion.metadata.symbol ?? '',
        name: evmSuggestion.metadata.name ?? '',
        decimals: new BigNumber(0),
        thumbnailUri: evmSuggestion.metadata.image ?? evmSuggestion.metadata.iconURL
      };
    }

    return {
      symbol: evmSuggestion.metadata.symbol ?? '',
      name: evmSuggestion.metadata.name ?? '',
      decimals: new BigNumber(evmSuggestion.metadata.decimals),
      thumbnailUri: evmSuggestion.metadata.iconURL
    };
  }, [evmSuggestion, tezosInitialValues]);

  const onEvmSubmit = (data: AddTokenInfoFormValues, suggestion: EvmTokenSuggestion) => {
    if (!isDefined(evmAccount)) {
      return false;
    }

    const chainId = ETHERLINK_MAINNET_CHAIN_ID;
    const slug = toEvmAssetSlug(suggestion.metadata.address);

    const metadata: EvmTokenMetadata = {
      ...suggestion.metadata,
      name: data.name,
      symbol: data.symbol,
      decimals: data.decimals.toNumber(),
      iconURL: isString(data.thumbnailUri) ? data.thumbnailUri : undefined
    };

    dispatch(
      setEvmAssetManualAction({
        account: evmAccount,
        chainId,
        slug,
        manual: true,
        standard: suggestion.metadata.standard
      })
    );
    dispatch(setEvmAssetVisibilityAction({ account: evmAccount, chainId, slug, visibility: VisibilityEnum.Visible }));
    dispatch(processLoadedEvmTokensMetadataAction({ chainId, metadata: { [slug]: metadata } }));

    if (isDefined(suggestion.exchangeRate)) {
      dispatch(processLoadedEvmExchangeRatesAction({ chainId, rates: { [slug]: suggestion.exchangeRate } }));
    }

    return true;
  };

  const onEvmCollectibleSubmit = (data: AddTokenInfoFormValues, suggestion: EvmCollectibleSuggestion) => {
    if (!isDefined(evmAccount)) {
      return false;
    }

    const chainId = ETHERLINK_MAINNET_CHAIN_ID;
    const slug = toEvmAssetSlug(suggestion.metadata.address, suggestion.metadata.tokenId);

    const userImageUri = isString(data.thumbnailUri) ? data.thumbnailUri : undefined;

    const metadata: EvmCollectibleMetadata = {
      ...suggestion.metadata,
      name: data.name,
      symbol: data.symbol,
      image: userImageUri ?? suggestion.metadata.image,
      iconURL: userImageUri ?? suggestion.metadata.iconURL
    };

    dispatch(
      setEvmAssetManualAction({
        account: evmAccount,
        chainId,
        slug,
        manual: true,
        standard: suggestion.metadata.standard
      })
    );
    dispatch(setEvmAssetVisibilityAction({ account: evmAccount, chainId, slug, visibility: VisibilityEnum.Visible }));
    dispatch(processLoadedEvmCollectiblesMetadataAction({ chainId, metadata: { [slug]: metadata } }));

    return true;
  };

  const onTezosSubmit = (data: AddTokenInfoFormValues) => {
    const tokenMetadata = { ...tezosInitialValues, ...data, decimals: data.decimals.toNumber() };

    dispatch(addTokenAction(tokenMetadata));
    dispatch(putTokenMetadataAction(tokenMetadata));

    return true;
  };

  const onSubmit = (data: AddTokenInfoFormValues) => {
    let isSuccess: boolean;
    if (!isDefined(evmSuggestion)) {
      isSuccess = onTezosSubmit(data);
    } else if (evmSuggestion.type === 'collectible') {
      isSuccess = onEvmCollectibleSubmit(data, evmSuggestion);
    } else {
      isSuccess = onEvmSubmit(data, evmSuggestion);
    }

    if (!isSuccess) {
      return void showErrorToast({ description: genericErrorMessage });
    }

    showSuccessToast({
      description: evmSuggestion?.type === 'collectible' ? 'NFT successfully added' : 'Token successfully added'
    });
    onFormSubmitted();
  };

  return (
    <Formik
      enableReinitialize={true} // (!) Might lead to unwanted form resets.
      initialValues={initialValues}
      validationSchema={addTokenInfoFormValidationSchema}
      onSubmit={onSubmit}
    >
      {({ submitForm, isValid }) => (
        <>
          <ScreenContainer isFullScreenMode={true}>
            <View>
              <Label label="Symbol" description="Token symbol, like ‘USD’ for United States Dollar" />
              <FormTextInput name="symbol" testID={AddAssetInfoSelectors.symbolInput} />

              <Label label="Name" description="Token name, like ‘Bitcoin’ for BTC assets." />
              <FormTextInput name="name" testID={AddAssetInfoSelectors.nameInput} />

              {evmSuggestion?.type !== 'collectible' && (
                <>
                  <Label
                    label="Decimals"
                    description="A number of decimal places after point. For example: 8 for BTC, 2 for USD."
                  />
                  <FormNumericInput
                    name="decimals"
                    decimals={0}
                    editable={!isDefined(evmSuggestion)}
                    testID={AddAssetInfoSelectors.decimalsInput}
                  />
                </>
              )}

              <Label label="Icon URL" description="Image URL for token logo." isOptional={true} />
              <FormTextInput name="thumbnailUri" testID={AddAssetInfoSelectors.iconUrlInput} />

              <Divider />
            </View>
          </ScreenContainer>

          <ModalButtonsFloatingContainer>
            <ButtonLargeSecondary
              title="Back"
              onPress={onCancelButtonPress}
              testID={AddAssetInfoSelectors.backButton}
            />
            <ButtonLargePrimary
              title="Confirm"
              disabled={!isValid}
              onPress={submitForm}
              testID={AddAssetInfoSelectors.confirmButton}
            />
          </ModalButtonsFloatingContainer>
        </>
      )}
    </Formik>
  );
};
