import { useIsFocused } from '@react-navigation/native';
import { BigNumber } from 'bignumber.js';
import { FormikProvider, useFormik } from 'formik';
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
import { safeShiftedBy } from 'src/utils/big-number.utils';
import { createEvmSwapIdentity, isSwapQuoteFresh, swapIdentityKey, validateSwapAssets } from 'src/utils/evm/swap.utils';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { BaseSwapForm } from '../base-swap-form/base-swap-form';
import { useSwapAssets } from '../components/swap-assets-context';
import { SwapExchangeRate } from '../swap-form/swap-exchange-rate/swap-exchange-rate';

import { createEvmSwapFormValidationSchema } from './evm-swap-form.form';
import { useEvmSwapQuote } from './use-evm-swap-quote';

interface Props {
  inputAsset?: EvmSwapAssetDescriptor;
  outputAsset?: EvmSwapAssetDescriptor;
}

interface FormValues {
  inputAssets: AssetAmountInterface<AssetInterface>;
  outputAssets: AssetAmountInterface<AssetInterface>;
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

  const validationSchema = useMemo(() => createEvmSwapFormValidationSchema(catalog), [catalog]);

  const formik = useFormik<FormValues>({
    initialValues: {
      inputAssets: {
        asset: {
          ...EMPTY_ASSET,
          assetSlug: inputAsset?.chainId === ETHERLINK_MAINNET_CHAIN_ID ? inputAsset.slug : EVM_TOKEN_SLUG
        }
      },
      outputAssets: {
        asset: {
          ...EMPTY_ASSET,
          assetSlug: outputAsset?.chainId === ETHERLINK_MAINNET_CHAIN_ID ? outputAsset.slug : ''
        }
      }
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: async () => review()
  });

  const { values, setValues, isValid, isSubmitting, submitCount, submitForm, validateForm } = formik;

  const inputSlug = values.inputAssets.asset.assetSlug;
  const outputSlug = values.outputAssets.asset.assetSlug;
  const amount = values.inputAssets.amount;

  const input = catalog.find(asset => asset.assetSlug === inputSlug);
  const output = catalog.find(asset => asset.assetSlug === outputSlug);

  const outputAssets = useMemo(() => catalog.filter(asset => asset.assetSlug !== inputSlug), [catalog, inputSlug]);

  useEffect(() => {
    if ((!input || input === values.inputAssets.asset) && (!output || output === values.outputAssets.asset)) return;

    void setValues(current => ({
      inputAssets: { ...current.inputAssets, asset: input ?? current.inputAssets.asset },
      outputAssets: { ...current.outputAssets, asset: output ?? current.outputAssets.asset }
    }));
  }, [input, output, values.inputAssets.asset, values.outputAssets.asset, setValues]);

  useEffect(() => {
    void validateForm();
  }, [validationSchema, validateForm]);
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
    if (!address || !input || !output || !amount || !chain || chain.disabled || chain.disabledAutomatically) return;
    try {
      return createEvmSwapIdentity(address, input, output, amount, slippage);
    } catch {
      return;
    }
  }, [address, input, output, amount, slippage, chain]);

  const quoteState = useEvmSwapQuote(identity, active);
  const { invalidate } = quoteState;

  const { quote, error: validationError } = useMemo(() => {
    if (!quoteState.quote || !input || !output) return {};
    try {
      validateSwapAssets(quoteState.quote, input, output);

      return { quote: quoteState.quote };
    } catch {
      return { error: new Error('The route token metadata does not match the selected assets. Retry the quote.') };
    }
  }, [quoteState.quote, input, output]);

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

  const changeInput = (value: AssetAmountInterface<AssetInterface>): boolean => {
    const asset = catalog.find(item => item.assetSlug === value.asset.assetSlug);
    if (!asset) return false;
    invalidate();
    void setValues(current => ({
      inputAssets: {
        asset,
        amount: asset.assetSlug === current.inputAssets.asset.assetSlug ? value.amount : undefined
      },
      outputAssets:
        asset.assetSlug === current.outputAssets.asset.assetSlug ? { asset: EMPTY_ASSET } : current.outputAssets
    }));

    return false;
  };

  const changeOutput = (value: AssetAmountInterface<AssetInterface>): boolean => {
    const asset = catalog.find(item => item.assetSlug === value.asset.assetSlug);
    if (!asset || asset.assetSlug === inputSlug) return false;
    invalidate();
    void setValues(current => ({ ...current, outputAssets: { asset } }));

    return false;
  };

  const review = (): void => {
    if (
      reviewing.current ||
      !isValid ||
      (input && amount?.gt(input.balance)) ||
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

  const displayedQuote = reviewedQuote ?? quote;
  const outputAtomicAmount = useMemo(
    () => (displayedQuote ? new BigNumber(displayedQuote.route.toAmount) : undefined),
    [displayedQuote]
  );

  const inputAmount =
    displayedQuote && input
      ? safeShiftedBy(new BigNumber(displayedQuote.route.fromAmount), -input.decimals)
      : undefined;
  const outputAmount = outputAtomicAmount && output ? safeShiftedBy(outputAtomicAmount, -output.decimals) : undefined;

  const minimumReceivedAmount =
    displayedQuote && output
      ? safeShiftedBy(new BigNumber(displayedQuote.route.toAmountMin), -output.decimals)
      : undefined;

  const quoteError = quoteState.error ?? validationError;
  const noRouteError = quoteError instanceof EvmSwapApiError && quoteError.code === 'no-route' ? quoteError : undefined;

  useEffect(() => {
    if (active && noRouteError) showErrorToast({ description: noRouteError.message });
  }, [active, noRouteError]);

  const maxInputAmount = useMemo(() => {
    if (!input || input.assetSlug !== EVM_TOKEN_SLUG) return input?.balance;

    const gasExpense = safeShiftedBy(new BigNumber(DEFAULT_EXPECTED_GAS_EXPENSE), input.decimals);

    return BigNumber.maximum(new BigNumber(input.balance).minus(gasExpense), 0);
  }, [input]);

  return (
    <FormikProvider value={formik}>
      <BaseSwapForm
        inputTokens={catalog}
        outputTokens={outputAssets}
        outputValue={{ asset: output ?? { ...EMPTY_ASSET, assetSlug: outputSlug }, amount: outputAtomicAmount }}
        isLoading={catalogLoading}
        onInputChange={changeInput}
        onOutputChange={changeOutput}
        inputProps={{ maxAmount: maxInputAmount, maxButtonDisabled: !input }}
        onReverse={() => {
          invalidate();
          void setValues({
            inputAssets: { asset: output ?? EMPTY_ASSET },
            outputAssets: { asset: input ?? EMPTY_ASSET }
          });
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
        submitDisabled={
          (submitCount !== 0 && !isValid) || (isValid && !quote) || !address || catalogLoading || isSubmitting
        }
        onSubmit={submitForm}
      />
    </FormikProvider>
  );
};
