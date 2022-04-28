import { OpKind } from '@taquito/rpc';
import { Formik } from 'formik';
import React, { FC, useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { getTradeOpParams } from 'swap-router-sdk';

import { SwapPriceUpdateBar } from '../../components/swap-price-update-bar/swap-price-update-bar';
import { tokenEqualityFn } from '../../components/token-dropdown/token-equality-fn';
import { useFilteredAssetsList } from '../../hooks/use-filtered-assets-list.hook';
import { useReadOnlyTezosToolkit } from '../../hooks/use-read-only-tezos-toolkit.hook';
import { ConfirmationTypeEnum } from '../../interfaces/confirm-payload/confirmation-type.enum';
import { ParamsWithKind } from '../../interfaces/op-params.interface';
import { SwapFormValues } from '../../interfaces/swap-asset.interface';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { navigateAction } from '../../store/root-state.actions';
import {
  useSelectedAccountSelector,
  useTezosTokenSelector,
  useVisibleAccountsListSelector,
  useVisibleAssetListSelector
} from '../../store/wallet/wallet-selectors';
import { emptyToken, TokenInterface } from '../../token/interfaces/token.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import { AnalyticsEventCategory } from '../../utils/analytics/analytics-event.enum';
import { useAnalytics, usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { SwapForm } from './swap-form';
import { swapFormValidationSchema } from './swap-form.form';
import { getRoutingFeeTransferParams } from './swap.util';

export const SwapScreen: FC = () => {
  const { trackEvent } = useAnalytics();
  const visibleAccounts = useVisibleAccountsListSelector();
  const tezosToken = useTezosTokenSelector();
  const assetsList = useVisibleAssetListSelector();
  const { filteredAssetsList } = useFilteredAssetsList(assetsList, true);
  const selectedAccount = useSelectedAccountSelector();
  const tezos = useReadOnlyTezosToolkit(selectedAccount);
  const dispatch = useDispatch();
  usePageAnalytic(ScreensEnum.SwapScreen);

  // TODO: ADD TYPES FOR SWAP ASSETS
  // TODO ADD validation schema

  const onHandleSubmit = async (values: SwapFormValues) => {
    const { inputAssets, outputAssets, bestTradeWithSlippageTolerance } = values;

    const inputMutezAmount = inputAssets.amount;

    const inputAssetSlug = getTokenSlug(inputAssets.asset);
    const outputAssetSlug = getTokenSlug(outputAssets.asset);

    const analyticsProperties = {
      inputAsset: inputAssetSlug,
      outputAsset: outputAssetSlug
    };

    trackEvent('SWAP_FORM_SUBMIT', AnalyticsEventCategory.FormSubmit, analyticsProperties);
    const routingFeeOpParams = await getRoutingFeeTransferParams(
      inputMutezAmount,
      bestTradeWithSlippageTolerance,
      selectedAccount.publicKeyHash,
      tezos
    );
    const tradeOpParams = await getTradeOpParams(bestTradeWithSlippageTolerance, selectedAccount.publicKeyHash, tezos);

    const opParams: Array<ParamsWithKind> = [...routingFeeOpParams, ...tradeOpParams].map(transferParams => ({
      ...transferParams,
      kind: OpKind.TRANSACTION
    }));

    dispatch(navigateAction(ModalsEnum.Confirmation, { type: ConfirmationTypeEnum.InternalOperations, opParams }));
  };

  const filteredAssetsListWithTez = useMemo<TokenInterface[]>(
    () => [tezosToken, ...filteredAssetsList],
    [tezosToken, filteredAssetsList]
  );

  const sendModalInitialValues = useMemo(
    () => ({
      inputAssets: {
        asset: filteredAssetsListWithTez.find(item => tokenEqualityFn(item, tezosToken)) ?? emptyToken,
        amount: undefined
      },
      outputAssets: { asset: emptyToken, amount: undefined },
      bestTrade: [],
      bestTradeWithSlippageTolerance: []
    }),
    [filteredAssetsListWithTez, visibleAccounts]
  );

  return (
    <ScrollView>
      <SwapPriceUpdateBar />
      <Formik
        initialValues={sendModalInitialValues}
        enableReinitialize={true}
        validationSchema={swapFormValidationSchema}
        onSubmit={onHandleSubmit}
      >
        {() => <SwapForm />}
      </Formik>
    </ScrollView>
  );
};
