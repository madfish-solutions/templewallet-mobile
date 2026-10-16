import { BigNumber } from 'bignumber.js';
import { Formik } from 'formik';
import React, { FC } from 'react';
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
import { putEvmCollectiblesMetadataAction } from 'src/store/evm/collectibles-metadata/evm-collectibles-metadata-actions';
import { processLoadedEvmExchangeRatesAction } from 'src/store/evm/exchange-rates/evm-exchange-rates-actions';
import { putEvmTokensMetadataAction } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-actions';
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

import { useAddAssetModalStyles } from '../styles';
import { genericErrorMessage, EvmAssetSuggestion } from '../types';

import { addTokenInfoFormValidationSchema, AddTokenInfoFormValues } from './add-asset-info.form';
import { AddAssetInfoSelectors } from './add-asset-info.selectors';

interface Props {
  evmSuggestion?: EvmAssetSuggestion;
  onCancelButtonPress: EmptyFn;
  onFormSubmitted: EmptyFn;
}

const getEvmSuggestionName = (suggestion: EvmAssetSuggestion) =>
  suggestion.type === 'collectible'
    ? suggestion.metadata.collectibleName ?? suggestion.metadata.name
    : suggestion.metadata.name;

const getEvmInitialValues = (suggestion: EvmAssetSuggestion): AddTokenInfoFormValues => ({
  symbol: suggestion.metadata.symbol ?? '',
  name: getEvmSuggestionName(suggestion) ?? '',
  decimals: new BigNumber(suggestion.type === 'collectible' ? 0 : suggestion.metadata.decimals),
  thumbnailUri:
    suggestion.type === 'collectible'
      ? suggestion.metadata.image ?? suggestion.metadata.iconURL
      : suggestion.metadata.iconURL
});

export const AddAssetInfo: FC<Props> = ({ evmSuggestion, onCancelButtonPress, onFormSubmitted }) => {
  const styles = useAddAssetModalStyles();
  const dispatch = useDispatch();
  const tokenSuggestion = useAddTokenSuggestionSelector();
  const evmAccount = useAccountAddressForEvm();

  const isCollectible = evmSuggestion?.type === 'collectible';

  const tezosInitialValues = { ...tokenSuggestion.data, decimals: new BigNumber(tokenSuggestion.data.decimals) };
  const initialValues = isDefined(evmSuggestion) ? getEvmInitialValues(evmSuggestion) : tezosInitialValues;

  const onEvmSubmit = (data: AddTokenInfoFormValues, suggestion: EvmAssetSuggestion, account: HexString) => {
    const chainId = ETHERLINK_MAINNET_CHAIN_ID;
    const slug =
      suggestion.type === 'collectible'
        ? toEvmAssetSlug(suggestion.metadata.address, suggestion.metadata.tokenId)
        : toEvmAssetSlug(suggestion.metadata.address);
    const userIconUri = isString(data.thumbnailUri) ? data.thumbnailUri : undefined;

    dispatch(setEvmAssetManualAction({ account, chainId, slug, manual: true, standard: suggestion.metadata.standard }));
    dispatch(setEvmAssetVisibilityAction({ account, chainId, slug, visibility: VisibilityEnum.Visible }));

    if (suggestion.type === 'collectible') {
      const metadata: EvmCollectibleMetadata = {
        ...suggestion.metadata,
        collectibleName: data.name,
        symbol: data.symbol,
        image: userIconUri
      };

      dispatch(putEvmCollectiblesMetadataAction({ chainId, metadata: { [slug]: metadata } }));

      return;
    }

    const metadata: EvmTokenMetadata = {
      ...suggestion.metadata,
      name: data.name,
      symbol: data.symbol,
      decimals: data.decimals.toNumber(),
      iconURL: userIconUri
    };

    dispatch(putEvmTokensMetadataAction({ chainId, metadata: { [slug]: metadata } }));

    if (isDefined(suggestion.exchangeRate)) {
      dispatch(processLoadedEvmExchangeRatesAction({ chainId, rates: { [slug]: suggestion.exchangeRate } }));
    }
  };

  const onTezosSubmit = (data: AddTokenInfoFormValues) => {
    const tokenMetadata = { ...tezosInitialValues, ...data, decimals: data.decimals.toNumber() };

    dispatch(addTokenAction(tokenMetadata));
    dispatch(putTokenMetadataAction(tokenMetadata));
  };

  const onSubmit = (data: AddTokenInfoFormValues) => {
    if (!isDefined(evmSuggestion)) {
      onTezosSubmit(data);
    } else if (!isDefined(evmAccount)) {
      return void showErrorToast({ description: genericErrorMessage });
    } else {
      onEvmSubmit(data, evmSuggestion, evmAccount);
    }

    showSuccessToast({ description: isCollectible ? 'NFT successfully added' : 'Token successfully added' });
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
              <FormTextInput name="symbol" style={styles.input} testID={AddAssetInfoSelectors.symbolInput} />

              <Label label="Name" description="Token name, like ‘Bitcoin’ for BTC assets." />
              <FormTextInput name="name" style={styles.input} testID={AddAssetInfoSelectors.nameInput} />

              {!isCollectible && (
                <>
                  <Label
                    label="Decimals"
                    description="A number of decimal places after point. For example: 8 for BTC, 2 for USD."
                  />
                  <FormNumericInput
                    name="decimals"
                    decimals={0}
                    editable={false}
                    style={[styles.input, styles.disabledInput]}
                    testID={AddAssetInfoSelectors.decimalsInput}
                  />
                </>
              )}

              <Label label="Icon URL" description="Image URL for token logo." isOptional={true} />
              <FormTextInput name="thumbnailUri" style={styles.input} testID={AddAssetInfoSelectors.iconUrlInput} />

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
