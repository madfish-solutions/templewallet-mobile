import { useFormikContext } from 'formik';
import React, { FC, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { AssetAmountInterface } from 'src/components/asset-amount-input/asset-amount-input';
import { SwapFormValues } from 'src/interfaces/swap-asset.interface';
import { resetSwapParamsAction } from 'src/store/swap/swap-actions';

import { SwapDirectionButton } from '../../components/swap-direction-button';
import { SwapFormSelectors } from '../swap-form.selectors';

export const SwapAssetsButton: FC = () => {
  const dispatch = useDispatch();
  const { values, setValues } = useFormikContext<SwapFormValues>();
  const { inputAssets, outputAssets } = values;

  const swapAction = useCallback(
    (inputAsset: AssetAmountInterface, outputAsset: AssetAmountInterface) => {
      setValues({
        inputAssets: { asset: outputAsset.asset, amount: undefined },
        outputAssets: { asset: inputAsset.asset, amount: undefined }
      });

      dispatch(resetSwapParamsAction());
    },
    [dispatch, setValues]
  );

  return (
    <SwapDirectionButton
      onPress={() => swapAction(inputAssets, outputAssets)}
      testID={SwapFormSelectors.swapAssetsButton}
    />
  );
};
