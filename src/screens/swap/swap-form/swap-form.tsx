import { OpKind } from '@taquito/rpc';
import { ParamsWithKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { FormikProvider, isString, useFormik } from 'formik';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { AssetAmountInterface } from 'src/components/asset-amount-input/asset-amount-input';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { Divider } from 'src/components/divider/divider';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { tokenEqualityFn } from 'src/components/token-dropdown/token-equality-fn';
import { FormAssetAmountInput } from 'src/form/form-asset-amount-input/form-asset-amount-input';
import { useFilteredAssetsList } from 'src/hooks/use-filtered-assets-list.hook';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { useRoute3 } from 'src/hooks/use-route3.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { SwapFormValues } from 'src/interfaces/swap-asset.interface';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { navigateAction } from 'src/store/root-state.actions';
import { loadRoute3SwapParamsAction, resetRoute3SwapParamsAction } from 'src/store/route3/route3-actions';
import { useRoute3SwapParamsSelector } from 'src/store/route3/route3-selectors';
import { useSlippageSelector } from 'src/store/settings/settings-selectors';
import {
  useTokensWithTezosListSelector,
  useSelectedAccountTezosTokenSelector,
  useSelectedAccountSelector
} from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/toast.utils';
import { emptyTezosLikeToken, TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { getTransferPermissions } from 'src/utils/swap-permissions.util';

import { ROUTE3_CONTRACT } from '../config';
import { SwapAssetsButton } from './swap-assets-button/swap-assets-button';
import { SwapExchangeRate } from './swap-exchange-rate/swap-exchange-rate';
import { swapFormValidationSchema } from './swap-form.form';
import { SwapRoute } from './swap-route/swap-route';

const selectionOptions = { start: 0, end: 0 };

interface SwapFormProps {
  inputToken?: TokenInterface;
  outputToken?: TokenInterface;
}

export const SwapForm: FC<SwapFormProps> = ({ inputToken, outputToken }) => {
  const dispatch = useDispatch();
  const getRoute3SwapParams = useRoute3();
  const { trackEvent } = useAnalytics();
  const selectedAccount = useSelectedAccountSelector();
  const tezos = useReadOnlyTezosToolkit(selectedAccount);
  const slippageTolerance = useSlippageSelector();

  const { data: swapParams } = useRoute3SwapParamsSelector();
  const assetsList = useTokensWithTezosListSelector();

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

    const tradeOpParams = await getRoute3SwapParams(
      inputAssets.asset,
      outputAssets.asset,
      inputAssets.amount,
      slippageRatio
    );

    if (!tradeOpParams) {
      return;
    }

    const { approve, revoke } = await getTransferPermissions(
      tezos,
      ROUTE3_CONTRACT,
      selectedAccount.publicKeyHash,
      inputAssets.asset,
      inputAssets.amount
    );

    const opParams: Array<ParamsWithKind> = [...approve, tradeOpParams, ...revoke].map(transferParams => ({
      ...transferParams,
      kind: OpKind.TRANSACTION
    }));

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

  const tezosToken = useSelectedAccountTezosTokenSelector();

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

  const inputAssetSlug = tokenEqualityFn(inputAssets.asset, emptyTezosLikeToken)
    ? undefined
    : getTokenSlug(inputAssets.asset);
  const outputAssetSlug = tokenEqualityFn(outputAssets.asset, emptyTezosLikeToken)
    ? undefined
    : getTokenSlug(outputAssets.asset);

  const { filteredAssetsList, setSearchValue } = useFilteredAssetsList(assetsList, true);

  const [searchValue, setSearchTezAssetsValue] = useState<string>();

  const assetsListWithTez = useMemo(() => {
    const sourceArray = assetsList;

    if (isString(searchValue)) {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      const result: TokenInterface[] = [];

      for (const asset of sourceArray) {
        const { name, symbol, address } = asset;

        if (
          name.toLowerCase().includes(lowerCaseSearchValue) ||
          symbol.toLowerCase().includes(lowerCaseSearchValue) ||
          address.toLowerCase().includes(lowerCaseSearchValue)
        ) {
          result.push(asset);
        }
      }

      return result;
    } else {
      return sourceArray;
    }
  }, [searchValue, assetsList]);

  useEffect(() => {
    dispatch(resetRoute3SwapParamsAction());
  }, []);

  useEffect(() => {
    setFieldValue('outputAssets', {
      asset: outputAssets.asset,
      amount:
        swapParams.output === undefined
          ? undefined
          : new BigNumber(swapParams.output).multipliedBy(10 ** outputAssets.asset.decimals)
    });
  }, [swapParams.output, outputAssets.asset]);

  const handleInputAssetsValueChange = useCallback(
    (newInputValue: AssetAmountInterface) => {
      const isEmptyToken = tokenEqualityFn(newInputValue.asset, emptyTezosLikeToken);
      if (getTokenSlug(newInputValue.asset) === outputAssetSlug && !isEmptyToken) {
        setFieldValue('outputAssets', { asset: emptyTezosLikeToken, amount: undefined });
      }

      if (newInputValue.amount) {
        dispatch(
          loadRoute3SwapParamsAction.submit({
            fromSymbol: inputAssets.asset.symbol === 'TEZ' ? 'xtz' : inputAssets.asset.symbol,
            toSymbol: outputAssets.asset.symbol === 'TEZ' ? 'xtz' : outputAssets.asset.symbol,
            amount: newInputValue.amount.dividedBy(10 ** inputAssets.asset.decimals).toFixed()
          })
        );
      }
    },
    [outputAssetSlug, setFieldValue]
  );

  const handleOutputAssetsValueChange = useCallback(
    (newOutputValue: AssetAmountInterface) => {
      if (getTokenSlug(newOutputValue.asset) === inputAssetSlug) {
        setFieldValue('inputAssets', { asset: emptyTezosLikeToken, amount: undefined });
      }
    },
    [inputAssetSlug, setFieldValue]
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
          assetsList={filteredAssetsList}
          setSearchValue={setSearchValue}
          onValueChange={handleInputAssetsValueChange}
        />
        <SwapAssetsButton />
        <FormAssetAmountInput
          name="outputAssets"
          label="To"
          selectionOptions={selectionOptions}
          toUsdToggle={false}
          editable={false}
          isSearchable
          assetsList={assetsListWithTez}
          setSearchValue={setSearchTezAssetsValue}
          onValueChange={handleOutputAssetsValueChange}
        />
        <View>
          <SwapExchangeRate
            inputAsset={inputAssets.asset}
            slippageRatio={slippageRatio}
            outputAsset={outputAssets.asset}
          />
          <SwapRoute />
        </View>
      </ScreenContainer>
      <ButtonsFloatingContainer>
        <ButtonLargePrimary disabled={submitCount !== 0 && !isValid} title="Swap" onPress={submitForm} />
      </ButtonsFloatingContainer>
    </FormikProvider>
  );
};
