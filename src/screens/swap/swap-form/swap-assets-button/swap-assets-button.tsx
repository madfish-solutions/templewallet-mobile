import { useFormikContext } from 'formik';
import React, { FC, useCallback } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { resetSwapParamsAction } from 'src/store/swap/swap-actions';

import { AssetAmountInterface } from '../../../../components/asset-amount-input/asset-amount-input';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { TouchableIcon } from '../../../../components/icon/touchable-icon/touchable-icon';
import { SwapFormValues } from '../../../../interfaces/swap-asset.interface';
import { formatSize } from '../../../../styles/format-size';
import { SwapFormSelectors } from '../swap-form.selectors';
import { SwapAssetsButtonStyles } from './swap-assets-button.styles';

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
    [inputAssets, outputAssets]
  );

  return (
    <View style={SwapAssetsButtonStyles.container}>
      <TouchableIcon
        onPress={() => swapAction(inputAssets, outputAssets)}
        name={IconNameEnum.SwapArrow}
        size={formatSize(24)}
        testID={SwapFormSelectors.swapAssetsButton}
      />
    </View>
  );
};
