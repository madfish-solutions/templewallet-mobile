import { useFormikContext } from 'formik';
import React, { FC, useCallback } from 'react';
import { View } from 'react-native';

import { AssetAmountInterface } from '../../../components/asset-amount-input/asset-amount-input';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { TouchableIcon } from '../../../components/icon/touchable-icon/touchable-icon';
import { SwapFormValues } from '../../../interfaces/swap-asset.interface';
import { formatSize } from '../../../styles/format-size';
import { useSwapStyles } from '../swap.styles';

export const SwapAssetsButton: FC = () => {
  const styles = useSwapStyles();

  const { values, setFieldValue } = useFormikContext<SwapFormValues>();
  const { inputAssets, outputAssets } = values;

  const swapAction = useCallback(
    (inputAsset: AssetAmountInterface, outputAsset: AssetAmountInterface) => {
      setFieldValue('inputAssets', { asset: outputAsset.asset, amount: undefined });
      setFieldValue('outputAssets', { asset: inputAsset.asset, amount: undefined });
    },
    [outputAssets, inputAssets]
  );

  return (
    <View style={styles.swapIconContainer}>
      <TouchableIcon
        onPress={() => swapAction(inputAssets, outputAssets)}
        name={IconNameEnum.SwapArrow}
        size={formatSize(24)}
      />
    </View>
  );
};
