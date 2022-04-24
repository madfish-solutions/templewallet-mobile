import { Formik } from 'formik';
import React, { FC, useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';

import { SwapPriceUpdateBar } from '../../components/swap-price-update-bar/swap-price-update-bar';
import { tokenEqualityFn } from '../../components/token-dropdown/token-equality-fn';
import { useFilteredAssetsList } from '../../hooks/use-filtered-assets-list.hook';
import {
  useTezosTokenSelector,
  useVisibleAccountsListSelector,
  useVisibleAssetListSelector
} from '../../store/wallet/wallet-selectors';
import { emptyToken, TokenInterface } from '../../token/interfaces/token.interface';
import { SwapForm } from './swap-form';

export const SwapScreen: FC = () => {
  const visibleAccounts = useVisibleAccountsListSelector();
  const tezosToken = useTezosTokenSelector();
  const assetsList = useVisibleAssetListSelector();
  const { filteredAssetsList } = useFilteredAssetsList(assetsList, true);
  const dispatch = useDispatch();

  // TODO: ADD TYPES FOR SWAP ASSETS
  // TODO ADD validation schema

  const onHandleSubmit = values => {
    console.log(values);
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
      outputAssets: { asset: emptyToken, amount: undefined }
    }),
    [filteredAssetsListWithTez, visibleAccounts]
  );

  return (
    <ScrollView>
      <SwapPriceUpdateBar />
      <Formik
        initialValues={sendModalInitialValues}
        enableReinitialize={true}
        // validationSchema={sendModalValidationSchema}
        onSubmit={onHandleSubmit}
      >
        {() => <SwapForm />}
      </Formik>
    </ScrollView>
  );
};
