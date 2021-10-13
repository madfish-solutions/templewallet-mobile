import { BigNumber } from 'bignumber.js';
import { Formik } from 'formik';
import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { SchemaOf, object } from 'yup';

import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { bigNumberValidation } from '../../form/validation/big-number';
import { makeRequiredErrorMessage } from '../../form/validation/messages';
import { useFilteredAssetsList } from '../../hooks/use-filtered-assets-list.hook';
import { loadTokenWhitelist } from '../../store/swap/swap-actions';
import { useAssetsListSelector, useTezosTokenSelector } from '../../store/wallet/wallet-selectors';
import { TokenInterface, emptyToken } from '../../token/interfaces/token.interface';
import { SwapForm, SwapFormValues } from './swap-form';

export const Swap = () => {
  const dispatch = useDispatch();
  const assetsList = useAssetsListSelector();
  const { filteredAssetsList } = useFilteredAssetsList(assetsList, true);
  const tezosToken = useTezosTokenSelector();

  const filteredAssetsListWithTez = useMemo<TokenInterface[]>(
    () => [tezosToken, ...filteredAssetsList],
    [tezosToken, filteredAssetsList]
  );

  useEffect(() => {
    dispatch(loadTokenWhitelist.submit());
  }, []);

  // TODO: move to separate file
  const swapFormInitialValues = useMemo<SwapFormValues>(
    () => ({
      swapFromAmount: {
        asset: tezosToken,
        amount: new BigNumber(0)
      },
      swapToAmount: {
        asset: emptyToken,
        amount: new BigNumber(0)
      }
    }),
    [filteredAssetsListWithTez]
  );

  const swapFormValidationSchema: SchemaOf<SwapFormValues> = object().shape({
    // TODO: move validation in separate file (also reuse in send modal form)
    swapFromAmount: object().shape({
      asset: object().shape({}).required(makeRequiredErrorMessage('Asset')),
      amount: bigNumberValidation
        .clone()
        .required(makeRequiredErrorMessage('Amount'))
        .test('is-greater-than', 'Should be greater than 0', (value: unknown) => {
          if (value instanceof BigNumber) {
            return value.gt(0);
          }

          return false;
        })
    }),
    swapToAmount: object().shape({
      asset: object().shape({}).required(makeRequiredErrorMessage('Asset'))
    })
  });

  return (
    <Formik
      initialValues={swapFormInitialValues}
      enableReinitialize={true}
      validationSchema={swapFormValidationSchema}
      onSubmit={() => console.log('test')}
    >
      {() => (
        <ScreenContainer>
          <InsetSubstitute />
          <SwapForm />
        </ScreenContainer>
      )}
    </Formik>
  );
};
