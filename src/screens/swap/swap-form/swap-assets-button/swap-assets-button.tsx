import { useFormikContext } from 'formik';
import React, { FC, useCallback } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { AssetAmountInterface } from 'src/components/asset-amount-input/asset-amount-input';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum.ts';
import { TouchableIconV2 } from 'src/components/touchable-icon-v2';
import { SwapFormValues } from 'src/interfaces/swap-asset.interface';
import { resetSwapParamsAction } from 'src/store/swap/swap-actions';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';

import { SwapFormSelectors } from '../swap-form.selectors';

import { SwapAssetsButtonStyles } from './swap-assets-button.styles';

export const SwapAssetsButton: FC = () => {
  const dispatch = useDispatch();
  const colors = useColors();
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
    [inputAssets, outputAssets]
  );

  return (
    <View style={SwapAssetsButtonStyles.container}>
      <TouchableIconV2
        onPress={() => swapAction(inputAssets, outputAssets)}
        name={IconNameV2Enum.ArrowUpDown}
        size={formatSize(24)}
        iconSize={24}
        color={colors.orange}
        testID={SwapFormSelectors.swapAssetsButton}
      />
    </View>
  );
};
