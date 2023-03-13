import { OpKind } from '@taquito/rpc';
import { ParamsWithKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { FormikProvider, useFormik } from 'formik';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { AssetAmountInterface } from 'src/components/asset-amount-input/asset-amount-input';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { Divider } from 'src/components/divider/divider';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { tokenEqualityFn } from 'src/components/token-dropdown/token-equality-fn';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { FormAssetAmountInput } from 'src/form/form-asset-amount-input/form-asset-amount-input';
import { useBlockLevel } from 'src/hooks/use-block-level.hook';
import { useFilteredAssetsList } from 'src/hooks/use-filtered-assets-list.hook';
import { useFilteredSwapTokensList } from 'src/hooks/use-filtered-swap-tokens.hook';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { useSwap } from 'src/hooks/use-swap.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { Route3SwapParamsResponse } from 'src/interfaces/route3.interface';
import { SwapFormValues } from 'src/interfaces/swap-asset.interface';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { createEntity } from 'src/store/create-entity';
import { navigateAction } from 'src/store/root-state.actions';
import { useSlippageSelector } from 'src/store/settings/settings-selectors';
import { LoadableEntityState } from 'src/store/types';
import {
  useSelectedAccountSelector,
  useSelectedAccountTezosTokenSelector,
  useTokensListSelector
} from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/toast.utils';
import { emptyTezosLikeToken, TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';
import { fetchRoute3SwapParams, getRoute3TokenSymbol } from 'src/utils/route3.util';

import { ROUTING_FEE_RATIO } from '../config';
import { getRoutingFeeTransferParams } from '../swap.util';
import { SwapAssetsButton } from './swap-assets-button/swap-assets-button';
import { SwapDisclaimer } from './swap-disclaimer/swap-disclaimer';
import { SwapExchangeRate } from './swap-exchange-rate/swap-exchange-rate';
import { swapFormValidationSchema } from './swap-form.form';
import { SwapFormSelectors } from './swap-form.selectors';
import { SwapRoute } from './swap-route/swap-route';

const selectionOptions = { start: 0, end: 0 };
const TEMPLE_TOKEN: TokenInterface = {
  address: 'KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb',
  decimals: 6,
  exchangeRate: 0.38158038815461065,
  id: 0,
  name: 'Quipuswap Governance Token',
  symbol: 'QUIPU',
  thumbnailUri: 'ipfs://Qmb2GiHN9EjcrN29J6y9PsXu3ZDosXTv6uLUWGZfRRSzS2/quipu.png',
  balance: '0',
  visibility: VisibilityEnum.Visible
};

interface SwapFormProps {
  inputToken?: TokenInterface;
  outputToken?: TokenInterface;
}

export const SwapForm: FC<SwapFormProps> = ({ inputToken, outputToken }) => {
  const dispatch = useDispatch();
  const getSwapParams = useSwap();
  const { trackEvent } = useAnalytics();
  const slippageTolerance = useSlippageSelector();
  const assetsList = useTokensListSelector();
  const tezosToken = useSelectedAccountTezosTokenSelector();
  const selectedAccount = useSelectedAccountSelector();
  const tezos = useReadOnlyTezosToolkit(selectedAccount);
  const blockLevel = useBlockLevel();

  const [swapParams, setSwapParams] = useState<LoadableEntityState<Route3SwapParamsResponse>>(
    createEntity({ input: 0, output: 0, chains: [] })
  );

  const slippageRatio = useMemo(() => (100 - slippageTolerance) / 100, [slippageTolerance]);

  const handleSubmit = async () => {
    const inputAssetSlug = getTokenSlug(inputAssets.asset);
    const outputAssetSlug = getTokenSlug(outputAssets.asset);

    const analyticsProperties = {
      inputAsset: inputAssetSlug,
      outputAsset: outputAssetSlug
    };

    trackEvent('SWAP_FORM_SUBMIT', AnalyticsEventCategory.FormSubmit, analyticsProperties);

    if (!inputAssets.amount) {
      return;
    }
    const inputAmountAtomic = new BigNumber(swapParams.data.input ?? 0).multipliedBy(10 ** inputAssets.asset.decimals);

    const swapOpParams = await getSwapParams(
      inputAssets.asset,
      outputAssets.asset,
      inputAmountAtomic,
      minimumReceivedAmountAtomic,
      swapParams.data.chains
    );

    const swapToTempleParams = await fetchRoute3SwapParams({
      fromSymbol: getRoute3TokenSymbol(outputAssets.asset),
      toSymbol: getRoute3TokenSymbol(TEMPLE_TOKEN),
      amount: routingFeeAtomic.dividedBy(10 ** outputAssets.asset.decimals).toFixed()
    });

    const swapToTempleTokenOpParams = await getSwapParams(
      outputAssets.asset,
      TEMPLE_TOKEN,
      routingFeeAtomic,
      routingFeeAtomic,
      swapToTempleParams.chains
    );

    const routingFeeOpParams = await getRoutingFeeTransferParams(
      outputAssets.asset,
      routingFeeAtomic.dividedToIntegerBy(2),
      selectedAccount.publicKeyHash,
      tezos
    );
    if (swapOpParams === undefined || swapToTempleTokenOpParams === undefined) {
      return;
    }

    const opParams: Array<ParamsWithKind> = [...swapOpParams, ...swapToTempleTokenOpParams, ...routingFeeOpParams].map(
      transferParams => ({
        ...transferParams,
        kind: OpKind.TRANSACTION
      })
    );

    if (opParams.length === 0) {
      showErrorToast({ description: 'Transaction params not loaded' });
    }

    dispatch(
      navigateAction(ModalsEnum.Confirmation, {
        type: ConfirmationTypeEnum.InternalOperations,
        opParams,
        testID: 'SWAP_TRANSACTION_SENT'
      })
    );
  };

  const formik = useFormik<SwapFormValues>({
    initialValues: {
      inputAssets: {
        asset: inputToken ?? tezosToken,
        amount: undefined
      },
      outputAssets: {
        asset: outputToken ?? emptyTezosLikeToken,
        amount: undefined
      }
    },
    validationSchema: swapFormValidationSchema,
    onSubmit: handleSubmit
  });

  const { values, setFieldValue, isValid, submitForm, submitCount } = formik;
  const { inputAssets, outputAssets } = values;

  const { routingFeeAtomic, minimumReceivedAmountAtomic } = useMemo(() => {
    if (isDefined(swapParams.data.output)) {
      const swapOutputAtomic = new BigNumber(swapParams.data.output).multipliedBy(10 ** outputAssets.asset.decimals);
      const routingFeeAtomic = swapOutputAtomic
        .minus(swapOutputAtomic.multipliedBy(ROUTING_FEE_RATIO))
        .integerValue(BigNumber.ROUND_DOWN);
      const minimumReceivedAmountAtomic = swapOutputAtomic
        .minus(routingFeeAtomic)
        .multipliedBy(slippageRatio)
        .integerValue(BigNumber.ROUND_DOWN);

      return { routingFeeAtomic, minimumReceivedAmountAtomic };
    } else {
      const routingFeeAtomic = new BigNumber(0);
      const minimumReceivedAmountAtomic = new BigNumber(0);

      return { routingFeeAtomic, minimumReceivedAmountAtomic };
    }
  }, [swapParams.data.output, slippageRatio]);

  const inputAssetSlug = tokenEqualityFn(inputAssets.asset, emptyTezosLikeToken)
    ? undefined
    : getTokenSlug(inputAssets.asset);
  const outputAssetSlug = tokenEqualityFn(outputAssets.asset, emptyTezosLikeToken)
    ? undefined
    : getTokenSlug(outputAssets.asset);

  const { filteredTokensList, setSearchValue } = useFilteredSwapTokensList(assetsList);

  const { filteredAssetsList: toAssetsList, setSearchValue: setToSearchValue } = useFilteredAssetsList(
    assetsList,
    false,
    true,
    tezosToken
  );

  useEffect(() => {
    if (inputAssets.amount) {
      fetchRoute3SwapParams({
        fromSymbol: inputAssets.asset.symbol,
        toSymbol: outputAssets.asset.symbol,
        amount: inputAssets.amount.toFixed()
      }).then(params => setSwapParams(createEntity(params)));
    }
  }, [blockLevel]);

  useEffect(() => {
    setFieldValue('outputAssets', {
      asset: outputAssets.asset,
      amount:
        swapParams.data.output === undefined
          ? undefined
          : new BigNumber(swapParams.data.output).multipliedBy(10 ** outputAssets.asset.decimals)
    });
  }, [swapParams.data.output]);

  const handleInputAssetsValueChange = useCallback(
    (newInputValue: AssetAmountInterface) => {
      const isEmptyToken = tokenEqualityFn(newInputValue.asset, emptyTezosLikeToken);
      if (getTokenSlug(newInputValue.asset) === outputAssetSlug && !isEmptyToken) {
        setFieldValue('outputAssets', { asset: emptyTezosLikeToken, amount: undefined });
      }

      if (newInputValue.amount) {
        fetchRoute3SwapParams({
          fromSymbol: getRoute3TokenSymbol(newInputValue.asset),
          toSymbol: getRoute3TokenSymbol(outputAssets.asset),
          amount: newInputValue.amount.dividedBy(10 ** newInputValue.asset.decimals).toFixed()
        }).then(params => setSwapParams(createEntity(params)));
      } else {
        setSwapParams(createEntity({ input: 0, output: 0, chains: [] }));
      }
    },
    [outputAssetSlug, setFieldValue]
  );

  const handleOutputAssetsValueChange = useCallback(
    (newOutputValue: AssetAmountInterface) => {
      if (getTokenSlug(newOutputValue.asset) === inputAssetSlug) {
        setFieldValue('inputAssets', { asset: emptyTezosLikeToken, amount: undefined });
      }

      if (inputAssets.amount) {
        fetchRoute3SwapParams({
          fromSymbol: getRoute3TokenSymbol(inputAssets.asset),
          toSymbol: getRoute3TokenSymbol(newOutputValue.asset),
          amount: inputAssets.amount.dividedBy(10 ** inputAssets.asset.decimals).toFixed()
        }).then(params => setSwapParams(createEntity(params)));
      } else {
        setSwapParams(createEntity({ input: 0, output: 0, chains: [] }));
      }
    },
    [inputAssetSlug, setFieldValue, inputAssets.amount]
  );

  return (
    <FormikProvider value={formik}>
      <ScreenContainer>
        <Divider size={formatSize(8)} />

        <FormAssetAmountInput
          name="inputAssets"
          label="From"
          isSearchable
          maxButton
          assetsList={filteredTokensList}
          setSearchValue={setSearchValue}
          onValueChange={handleInputAssetsValueChange}
          testID={SwapFormSelectors.fromAssetAmountInput}
        />
        <SwapAssetsButton />

        <FormAssetAmountInput
          name="outputAssets"
          label="To"
          selectionOptions={selectionOptions}
          toUsdToggle={false}
          editable={false}
          isSearchable
          assetsList={toAssetsList}
          setSearchValue={setToSearchValue}
          onValueChange={handleOutputAssetsValueChange}
          testID={SwapFormSelectors.toAssetAmountInput}
        />
        <View>
          <SwapExchangeRate
            swapParams={swapParams.data}
            inputAsset={inputAssets.asset}
            slippageRatio={slippageRatio}
            outputAsset={outputAssets.asset}
          />
          <SwapRoute swapParams={swapParams.data} />
        </View>

        <SwapDisclaimer />
      </ScreenContainer>

      <ButtonsFloatingContainer>
        <ButtonLargePrimary
          disabled={submitCount !== 0 && !isValid}
          title="Swap"
          onPress={submitForm}
          testID={SwapFormSelectors.swapButton}
        />
      </ButtonsFloatingContainer>
    </FormikProvider>
  );
};
