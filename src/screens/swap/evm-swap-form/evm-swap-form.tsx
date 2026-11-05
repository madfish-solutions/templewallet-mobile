import { useIsFocused } from '@react-navigation/native';
import { BigNumber } from 'bignumber.js';
import { FormikProvider, useFormik } from 'formik';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Text } from 'react-native';

import { AssetAmountInterface } from 'src/components/asset-amount-input/asset-amount-input';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from 'src/components/divider/divider';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { AssetInterface } from 'src/interfaces/asset.interface';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { SwapFormValues } from 'src/interfaces/swap-asset.interface';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigateToModal } from 'src/navigator/hooks/use-navigation.hook';
import { dispatch } from 'src/store';
import { useSlippageSelector } from 'src/store/settings/settings-selectors';
import { loadEvmSwapTokensAction } from 'src/store/swap/swap-actions';
import { useEvmSwapTokensSelector } from 'src/store/swap/swap-selectors';
import { useAccountAddressForEvm, useCurrentAccountId } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { EVM_TOKEN_SLUG } from 'src/token/interfaces/token-metadata.interface';
import { emptyTezosLikeToken } from 'src/token/interfaces/token.interface';
import { EvmSwapAssetDescriptor } from 'src/types/evm-swap';
import { createEvmSwapIdentity, isSwapQuoteFresh, swapIdentityKey, validateSwapAssets } from 'src/utils/evm/swap.utils';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { BaseSwapForm } from '../base-swap-form/base-swap-form';
import { SwapExchangeRate } from '../swap-form/swap-exchange-rate/swap-exchange-rate';

import { useEvmSwapCatalog } from './use-evm-swap-catalog';
import { useEvmSwapQuote } from './use-evm-swap-quote';

interface Props {
  inputAsset?: EvmSwapAssetDescriptor;
  outputAsset?: EvmSwapAssetDescriptor;
}

export const EvmSwapForm: FC<Props> = ({ inputAsset, outputAsset }) => {
  const colors = useColors();
  const navigateToModal = useNavigateToModal();
  const accountId = useCurrentAccountId();
  const address = useAccountAddressForEvm();
  const chain = useEvmChain(ETHERLINK_MAINNET_CHAIN_ID);
  const focused = useIsFocused();
  const [appActive, setAppActive] = useState(AppState.currentState === 'active');
  const { error: catalogError, isLoading: catalogLoading } = useEvmSwapTokensSelector();
  const slippage = useSlippageSelector();
  const catalog = useEvmSwapCatalog();
  const emptyAsset = { ...emptyTezosLikeToken, chainKind: TempleChainKind.EVM, assetSlug: '' };
  const initialInputSlug = inputAsset?.chainId === ETHERLINK_MAINNET_CHAIN_ID ? inputAsset.slug : EVM_TOKEN_SLUG;
  const initialOutputSlug = outputAsset?.chainId === ETHERLINK_MAINNET_CHAIN_ID ? outputAsset.slug : '';
  const form = useFormik<SwapFormValues<AssetInterface>>({
    initialValues: {
      inputAssets: {
        asset: catalog.find(asset => asset.assetSlug === initialInputSlug) ?? {
          ...emptyAsset,
          assetSlug: initialInputSlug
        }
      },
      outputAssets: {
        asset: catalog.find(asset => asset.assetSlug === initialOutputSlug) ?? {
          ...emptyAsset,
          assetSlug: initialOutputSlug
        }
      }
    },
    onSubmit: () => undefined
  });
  const input = catalog.find(asset => asset.assetSlug === form.values.inputAssets.asset.assetSlug);
  const output = catalog.find(asset => asset.assetSlug === form.values.outputAssets.asset.assetSlug);
  const outputAssets = useMemo(
    () => catalog.filter(asset => asset.assetSlug !== form.values.inputAssets.asset.assetSlug),
    [catalog, form.values.inputAssets.asset.assetSlug]
  );
  const active = focused && appActive;
  const identity = useMemo(() => {
    if (
      !address ||
      !input ||
      !output ||
      !form.values.inputAssets.amount ||
      !chain ||
      chain.disabled ||
      chain.disabledAutomatically
    )
      return;
    try {
      return createEvmSwapIdentity(address, input, output, form.values.inputAssets.amount, slippage);
    } catch {
      return;
    }
  }, [address, input, output, form.values.inputAssets.amount, slippage, chain]);
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

  const changeInput = (value: AssetAmountInterface<AssetInterface>): false => {
    const asset = catalog.find(item => item.assetSlug === value.asset.assetSlug);
    if (!asset) return false;
    invalidate();
    void form.setValues({
      ...form.values,
      inputAssets: { asset, amount: asset.assetSlug === input?.assetSlug ? value.amount : undefined },
      outputAssets: {
        asset: asset.assetSlug === output?.assetSlug ? emptyAsset : output ?? form.values.outputAssets.asset
      }
    });

    return false;
  };
  const changeOutput = (value: AssetAmountInterface<AssetInterface>): false => {
    const asset = catalog.find(item => item.assetSlug === value.asset.assetSlug);
    if (!asset || asset.assetSlug === form.values.inputAssets.asset.assetSlug) return false;
    invalidate();
    void form.setFieldValue('outputAssets', { asset });

    return false;
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
    form.resetForm();
    invalidate();
  };
  const insufficientBalance = input && form.values.inputAssets.amount?.gt(input.balance);
  const { setFieldValue } = form;
  useEffect(() => {
    if (input) void setFieldValue('inputAssets.asset', input, false);
    if (output) void setFieldValue('outputAssets.asset', output, false);
  }, [input, output, setFieldValue]);

  const outputAtomicAmount = useMemo(() => (quote ? new BigNumber(quote.route.toAmount) : undefined), [quote]);

  const inputAmount = quote && input ? new BigNumber(quote.route.fromAmount).shiftedBy(-input.decimals) : undefined;
  const outputAmount = quote && output ? new BigNumber(quote.route.toAmount).shiftedBy(-output.decimals) : undefined;
  const minimumReceivedAmount =
    quote && output ? new BigNumber(quote.route.toAmountMin).shiftedBy(-output.decimals) : undefined;
  const error = catalogError ?? (quoteState.error ?? validatedQuote.error)?.message;

  return (
    <FormikProvider value={form}>
      <BaseSwapForm
        inputTokens={catalog}
        outputTokens={outputAssets}
        outputValue={{ asset: output ?? form.values.outputAssets.asset, amount: outputAtomicAmount }}
        isLoading={catalogLoading}
        onInputChange={changeInput}
        onOutputChange={changeOutput}
        inputProps={{ maxAmount: input?.balance, maxButtonDisabled: !input }}
        onReverse={() => {
          invalidate();
          void form.setValues({
            inputAssets: { asset: output ?? emptyAsset },
            outputAssets: { asset: input ?? emptyAsset }
          });
        }}
        reverseDisabled={!input && !output}
        exchangeRate={
          <SwapExchangeRate
            inputAsset={input ?? emptyAsset}
            outputAsset={output ?? emptyAsset}
            inputAmount={inputAmount}
            outputAmount={outputAmount}
            slippageRatio={1 - slippage / 100}
            routingFeeIsTakenFromOutput={false}
            minimumReceivedAmount={minimumReceivedAmount}
            chainKind={TempleChainKind.EVM}
          />
        }
        status={
          <>
            {insufficientBalance && <Text style={{ color: colors.black }}>Insufficient token balance.</Text>}
            {(!chain || chain.disabled || chain.disabledAutomatically) && (
              <Text style={{ color: colors.black }}>Etherlink mainnet is unavailable.</Text>
            )}
            {!address && <Text style={{ color: colors.black }}>This account has no Etherlink address.</Text>}
            {Boolean(error) && (
              <>
                <Divider size={formatSize(16)} />
                <Text style={{ color: colors.black }}>{error}</Text>
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
          </>
        }
        swapParamsAreLoading={quoteState.isLoading}
        submitDisabled={!quote || !address || Boolean(insufficientBalance) || catalogLoading}
        onSubmit={review}
      />
    </FormikProvider>
  );
};
