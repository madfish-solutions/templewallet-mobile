import { useIsFocused } from '@react-navigation/native';
import { BigNumber } from 'bignumber.js';
import { useFormik } from 'formik';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Text } from 'react-native';

import { AssetAmountInterface } from 'src/components/asset-amount-input/asset-amount-input';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { Divider } from 'src/components/divider/divider';
import { LoadingPlaceholder } from 'src/components/loading-placeholder/loading-placeholder';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { useEvmTransactionFee } from 'src/hooks/evm/use-evm-transaction-fee';
import { AssetInterface } from 'src/interfaces/asset.interface';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigateToModal } from 'src/navigator/hooks/use-navigation.hook';
import { useSlippageSelector } from 'src/store/settings/settings-selectors';
import { loadEvmSwapTokensAction } from 'src/store/swap/swap-actions';
import { useEvmSwapTokensSelector } from 'src/store/swap/swap-selectors';
import { useAccountAddressForEvm, useCurrentAccountId } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { EvmAssetStandardEnum, EVM_TOKEN_SLUG } from 'src/token/interfaces/token-metadata.interface';
import { emptyTezosLikeToken } from 'src/token/interfaces/token.interface';
import { EvmSwapAssetDescriptor } from 'src/types/evm-swap';
import {
  buildEvmSwapRequest,
  createEvmSwapIdentity,
  getNativeSwapMax,
  isSwapQuoteFresh,
  swapIdentityKey,
  validateSwapAssets
} from 'src/utils/evm/swap.utils';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { dispatch } from '../../../store';
import { SwapAssetAmountInput } from '../components/swap-asset-amount-input';
import { SwapDirectionButton } from '../components/swap-direction-button';
import { useSwapFormStyles } from '../swap-form/swap-form.styles';

import { EvmSwapDetails } from './evm-swap-details';
import { useEvmSwapCatalog } from './use-evm-swap-catalog';
import { useEvmSwapQuote } from './use-evm-swap-quote';

interface Props {
  inputAsset?: EvmSwapAssetDescriptor;
  outputAsset?: EvmSwapAssetDescriptor;
}
interface FormValues {
  inputSlug: string;
  outputSlug: string;
  amount?: BigNumber;
}

export const EvmSwapForm: FC<Props> = ({ inputAsset, outputAsset }) => {
  const styles = useSwapFormStyles();
  const colors = useColors();
  const navigateToModal = useNavigateToModal();
  const accountId = useCurrentAccountId();
  const address = useAccountAddressForEvm();
  const chain = useEvmChain(ETHERLINK_MAINNET_CHAIN_ID);
  const focused = useIsFocused();
  const [appActive, setAppActive] = useState(AppState.currentState === 'active');
  const { error: catalogError, isLoading: catalogLoading } = useEvmSwapTokensSelector();
  const slippage = useSlippageSelector();
  const form = useFormik<FormValues>({
    initialValues: {
      inputSlug: inputAsset?.chainId === ETHERLINK_MAINNET_CHAIN_ID ? inputAsset.slug : EVM_TOKEN_SLUG,
      outputSlug: outputAsset?.chainId === ETHERLINK_MAINNET_CHAIN_ID ? outputAsset.slug : ''
    },
    onSubmit: () => undefined
  });
  const catalog = useEvmSwapCatalog();
  const input = catalog.find(asset => asset.assetSlug === form.values.inputSlug);
  const output = catalog.find(asset => asset.assetSlug === form.values.outputSlug);
  const outputAssets = useMemo(
    () => catalog.filter(asset => asset.assetSlug !== form.values.inputSlug),
    [catalog, form.values.inputSlug]
  );
  const active = focused && appActive;
  const identity = useMemo(() => {
    if (!address || !input || !output || !form.values.amount || !chain || chain.disabled || chain.disabledAutomatically)
      return;
    try {
      return createEvmSwapIdentity(address, input, output, form.values.amount, slippage);
    } catch {
      return;
    }
  }, [address, input, output, form.values.amount, slippage, chain]);
  const quoteState = useEvmSwapQuote(identity, active);
  const { invalidate } = quoteState;
  const validatedQuote = useMemo(() => {
    if (!quoteState.quote || !input || !output) return {};
    try {
      validateSwapAssets(quoteState.quote, input, output);

      return { quote: quoteState.quote };
    } catch {
      return { error: new Error('The route token metadata does not match the selected assets. Retry the quote.') };
    }
  }, [quoteState.quote, input, output]);
  const quote = validatedQuote.quote;
  const reserveRequest = useMemo(() => {
    if (!quote || !input || !output || input.standard !== EvmAssetStandardEnum.NATIVE) return;
    try {
      return buildEvmSwapRequest(quote, input, output);
    } catch {
      return;
    }
  }, [quote, input, output]);
  const feeState = useEvmTransactionFee({
    chainId: ETHERLINK_MAINNET_CHAIN_ID,
    sourceAddress: address,
    request: reserveRequest
  });
  const maxAmount = getNativeSwapMax(input?.balance ?? '0', reserveRequest ? feeState.fee : undefined);
  const reviewing = useRef(false);

  useEffect(() => {
    const listener = AppState.addEventListener('change', state => {
      invalidate();
      setAppActive(state === 'active');
    });

    return () => listener.remove();
  }, [invalidate]);

  useEffect(() => {
    reviewing.current = false;
    if (focused) invalidate();
  }, [focused, invalidate]);

  const changeInput = (value: AssetAmountInterface<AssetInterface>): void => {
    const asset = catalog.find(item => item.assetSlug === value.asset.assetSlug);
    if (!asset) return;
    invalidate();
    void form.setValues({
      ...form.values,
      inputSlug: asset.assetSlug,
      outputSlug: asset.assetSlug === output?.assetSlug ? '' : form.values.outputSlug,
      amount: asset.assetSlug === input?.assetSlug ? value.amount : undefined
    });
  };
  const changeOutput = (value: AssetAmountInterface<AssetInterface>): void => {
    const asset = catalog.find(item => item.assetSlug === value.asset.assetSlug);
    if (!asset || asset.assetSlug === form.values.inputSlug) return;
    invalidate();
    void form.setFieldValue('outputSlug', asset.assetSlug);
  };
  const review = (): void => {
    if (
      reviewing.current ||
      !accountId ||
      !input ||
      !output ||
      !quote ||
      !identity ||
      quoteState.isLoading ||
      !isSwapQuoteFresh(quote) ||
      swapIdentityKey(identity) !== swapIdentityKey(quote.identity) ||
      !active ||
      AppState.currentState !== 'active'
    ) {
      invalidate();

      return;
    }
    try {
      validateSwapAssets(quote, input, output);
    } catch {
      invalidate();

      return;
    }
    reviewing.current = true;
    navigateToModal(ModalsEnum.Confirmation, {
      type: ConfirmationTypeEnum.EvmSwap,
      accountId,
      chainId: ETHERLINK_MAINNET_CHAIN_ID,
      quote,
      input,
      output
    });
    invalidate();
  };
  const insufficientBalance = input && form.values.amount?.gt(input.balance);
  const emptyAsset = { ...emptyTezosLikeToken, chainKind: TempleChainKind.EVM };

  return (
    <>
      <ScreenContainer>
        {catalogLoading && <LoadingPlaceholder text="Request token catalog..." />}
        <Divider size={formatSize(8)} />
        <SwapAssetAmountInput
          field="input"
          value={{ asset: input ?? emptyAsset, amount: form.values.amount }}
          assetsList={catalog}
          balance={input?.balance ?? '0'}
          onValueChange={changeInput}
          label="From"
          maxButton
          maxAmount={input?.standard === EvmAssetStandardEnum.NATIVE ? maxAmount : input?.balance}
          maxButtonDisabled={
            !input ||
            (input.standard === EvmAssetStandardEnum.NATIVE &&
              (maxAmount === undefined || feeState.isEstimating || Boolean(feeState.estimationError)))
          }
          footerErrorMessage={insufficientBalance ? 'Insufficient token balance.' : undefined}
          isSearchable
          showTokenNameForValue
          testID="EvmSwap/Input"
          tokenTestID="EvmSwap/InputToken"
        />
        {input?.standard === EvmAssetStandardEnum.NATIVE && maxAmount === undefined && (
          <Text style={{ color: colors.black }}>
            Enter an amount before you use MAX. The wallet reserves XTZ for the network fee.
          </Text>
        )}
        <SwapDirectionButton
          disabled={!input && !output}
          onPress={() => {
            invalidate();
            void form.setValues({
              inputSlug: form.values.outputSlug,
              outputSlug: form.values.inputSlug,
              amount: undefined
            });
          }}
          testID="EvmSwap/Reverse"
        />
        <SwapAssetAmountInput
          field="output"
          value={{ asset: output ?? emptyAsset, amount: quote ? new BigNumber(quote.route.toAmount) : undefined }}
          assetsList={outputAssets}
          balance={output?.balance ?? '0'}
          onValueChange={changeOutput}
          label="To"
          editable={false}
          isSearchable
          showTokenNameForValue
          testID="EvmSwap/Output"
          tokenTestID="EvmSwap/OutputToken"
          toUsdToggle={false}
          stylesConfig={{ amountInput: styles.outputAmountInput, inputContainer: styles.outputInputContainer }}
        />
        {quote && input && output && <EvmSwapDetails quote={quote} input={input} output={output} />}
        {(!chain || chain.disabled || chain.disabledAutomatically) && (
          <Text style={{ color: colors.black }}>Etherlink mainnet is unavailable.</Text>
        )}
        {!address && <Text style={{ color: colors.black }}>This account has no Etherlink address.</Text>}
        {Boolean(catalogError || quoteState.error || validatedQuote.error) && (
          <>
            <Divider size={formatSize(16)} />
            <Text style={{ color: colors.black }}>
              {catalogError ?? (quoteState.error ?? validatedQuote.error)?.message}
            </Text>
            <ButtonLargeSecondary
              title="Retry"
              onPress={() => {
                if (catalogError) dispatch(loadEvmSwapTokensAction.submit());
                else invalidate();
              }}
              testID="EvmSwap/Retry"
            />
          </>
        )}
      </ScreenContainer>
      <ButtonsFloatingContainer style={styles.buttonContainer}>
        <ButtonLargePrimary
          title={quoteState.isLoading ? 'Searching the best route' : 'Swap'}
          disabled={!quote || !address || Boolean(insufficientBalance) || quoteState.isLoading || catalogLoading}
          onPress={review}
          testID="EvmSwap/Review"
        />
      </ButtonsFloatingContainer>
    </>
  );
};
