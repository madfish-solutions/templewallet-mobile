import { useIsFocused } from '@react-navigation/native';
import { BigNumber } from 'bignumber.js';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { EvmSwapApiError } from 'src/apis/temple-wallet/evm-swap';
import { AssetAmountInterface } from 'src/components/asset-amount-input/asset-amount-input';
import { DEFAULT_EXPECTED_GAS_EXPENSE } from 'src/config/general';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { AssetInterface } from 'src/interfaces/asset.interface';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigateToModal } from 'src/navigator/hooks/use-navigation.hook';
import { dispatch } from 'src/store';
import { useSlippageSelector } from 'src/store/settings/settings-selectors';
import { loadEvmSwapTokensAction } from 'src/store/swap/swap-actions';
import { useEvmSwapTokensSelector } from 'src/store/swap/swap-selectors';
import { useAccountAddressForEvm, useCurrentAccountId } from 'src/store/wallet/wallet-selectors';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { EVM_TOKEN_SLUG } from 'src/token/interfaces/token-metadata.interface';
import { emptyTezosLikeToken } from 'src/token/interfaces/token.interface';
import { EvmSwapAssetDescriptor, EvmSwapQuote } from 'src/types/evm-swap';
import { createEvmSwapIdentity, isSwapQuoteFresh, swapIdentityKey, validateSwapAssets } from 'src/utils/evm/swap.utils';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { BaseSwapForm } from '../base-swap-form/base-swap-form';
import { useSwapAssets } from '../components/swap-assets-context';
import { SwapExchangeRate } from '../swap-form/swap-exchange-rate/swap-exchange-rate';

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

const EMPTY_ASSET = { ...emptyTezosLikeToken, chainKind: TempleChainKind.EVM, assetSlug: '' };
const TOKEN_PRICES_REFRESH_INTERVAL = 30_000;

export const EvmSwapForm: FC<Props> = ({ inputAsset, outputAsset }) => {
  const navigateToModal = useNavigateToModal();
  const accountId = useCurrentAccountId();
  const address = useAccountAddressForEvm();
  const chain = useEvmChain(ETHERLINK_MAINNET_CHAIN_ID);
  const focused = useIsFocused();
  const [appActive, setAppActive] = useState(AppState.currentState === 'active');
  const { isLoading: catalogLoading } = useEvmSwapTokensSelector();
  const slippage = useSlippageSelector();
  const { evmAssets: catalog } = useSwapAssets();
  const [values, setValues] = useState<FormValues>(() => ({
    inputSlug: inputAsset?.chainId === ETHERLINK_MAINNET_CHAIN_ID ? inputAsset.slug : EVM_TOKEN_SLUG,
    outputSlug: outputAsset?.chainId === ETHERLINK_MAINNET_CHAIN_ID ? outputAsset.slug : ''
  }));
  const input = catalog.find(asset => asset.assetSlug === values.inputSlug);
  const output = catalog.find(asset => asset.assetSlug === values.outputSlug);
  const outputAssets = useMemo(
    () => catalog.filter(asset => asset.assetSlug !== values.inputSlug),
    [catalog, values.inputSlug]
  );
  const active = focused && appActive;

  useEffect(() => {
    if (!active) return;
    const refreshTokens = (): void => {
      dispatch(loadEvmSwapTokensAction.submit());
    };
    refreshTokens();
    const interval = setInterval(refreshTokens, TOKEN_PRICES_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [active]);

  const identity = useMemo(() => {
    if (!address || !input || !output || !values.amount || !chain || chain.disabled || chain.disabledAutomatically)
      return;
    try {
      return createEvmSwapIdentity(address, input, output, values.amount, slippage);
    } catch {
      return;
    }
  }, [address, input, output, values.amount, slippage, chain]);
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
  const [reviewedQuote, setReviewedQuote] = useState<EvmSwapQuote>();

  useEffect(() => {
    const listener = AppState.addEventListener('change', state => {
      invalidate();
      setAppActive(state === 'active');
    });

    return () => listener.remove();
  }, [invalidate]);

  useEffect(() => {
    if (focused) {
      reviewing.current = false;
      setReviewedQuote(undefined);
      invalidate();
    }
  }, [focused, invalidate]);

  const changeInput = (value: AssetAmountInterface<AssetInterface>): void => {
    const asset = catalog.find(item => item.assetSlug === value.asset.assetSlug);
    if (!asset) return;
    invalidate();
    setValues(current => ({
      inputSlug: asset.assetSlug,
      amount: asset.assetSlug === current.inputSlug ? value.amount : undefined,
      outputSlug: asset.assetSlug === current.outputSlug ? '' : current.outputSlug
    }));
  };
  const changeOutput = (value: AssetAmountInterface<AssetInterface>): void => {
    const asset = catalog.find(item => item.assetSlug === value.asset.assetSlug);
    if (!asset || asset.assetSlug === values.inputSlug) return;
    invalidate();
    setValues(current => ({ ...current, outputSlug: asset.assetSlug }));
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
    setReviewedQuote(quote);
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
  const insufficientBalance = input && values.amount?.gt(input.balance);

  const displayedQuote = reviewedQuote ?? quote;
  const outputAtomicAmount = useMemo(
    () => (displayedQuote ? new BigNumber(displayedQuote.route.toAmount) : undefined),
    [displayedQuote]
  );

  const inputAmount =
    displayedQuote && input ? new BigNumber(displayedQuote.route.fromAmount).shiftedBy(-input.decimals) : undefined;
  const outputAmount =
    displayedQuote && output ? new BigNumber(displayedQuote.route.toAmount).shiftedBy(-output.decimals) : undefined;
  const minimumReceivedAmount =
    displayedQuote && output ? new BigNumber(displayedQuote.route.toAmountMin).shiftedBy(-output.decimals) : undefined;
  const quoteError = quoteState.error ?? validatedQuote.error;
  const noRouteError = quoteError instanceof EvmSwapApiError && quoteError.code === 'no-route' ? quoteError : undefined;
  useEffect(() => {
    if (active && noRouteError) showErrorToast({ description: noRouteError.message });
  }, [active, noRouteError]);
  const maxInputAmount = input
    ? input.assetSlug === EVM_TOKEN_SLUG
      ? BigNumber.maximum(
          new BigNumber(input.balance).minus(new BigNumber(DEFAULT_EXPECTED_GAS_EXPENSE).shiftedBy(input.decimals)),
          0
        )
      : input.balance
    : undefined;

  return (
    <BaseSwapForm
      inputTokens={catalog}
      inputValue={{ asset: input ?? { ...EMPTY_ASSET, assetSlug: values.inputSlug }, amount: values.amount }}
      outputTokens={outputAssets}
      outputValue={{ asset: output ?? { ...EMPTY_ASSET, assetSlug: values.outputSlug }, amount: outputAtomicAmount }}
      isLoading={catalogLoading}
      onInputChange={changeInput}
      onOutputChange={changeOutput}
      inputProps={{ maxAmount: maxInputAmount, maxButtonDisabled: !input }}
      onReverse={() => {
        invalidate();
        setValues({ inputSlug: output?.assetSlug ?? '', outputSlug: input?.assetSlug ?? '' });
      }}
      reverseDisabled={!input && !output}
      exchangeRate={
        <SwapExchangeRate
          inputAsset={input ?? EMPTY_ASSET}
          outputAsset={output ?? EMPTY_ASSET}
          inputAmount={inputAmount}
          outputAmount={outputAmount}
          slippageRatio={1 - slippage / 100}
          routingFeeIsTakenFromOutput={false}
          minimumReceivedAmount={minimumReceivedAmount}
          chainKind={TempleChainKind.EVM}
        />
      }
      swapParamsAreLoading={quoteState.isLoading}
      submitDisabled={!quote || !address || Boolean(insufficientBalance) || catalogLoading}
      onSubmit={review}
    />
  );
};
