import React, { FC } from 'react';
import { View } from 'react-native';

import { AssetAmountInterface } from '../../../components/asset-amount-input/asset-amount-input';
import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { EmptyFn } from '../../../config/general';
import { getTokenSlug } from '../../../token/utils/token.utils';
import { useSwapStyles } from '../swap.styles';

interface Props {
  inputAssets: AssetAmountInterface;
  outputAssets: AssetAmountInterface;
  onSubmit: EmptyFn;
}

export const SwapSubmitButton: FC<Props> = ({ inputAssets, outputAssets, onSubmit }) => {
  const styles = useSwapStyles();

  const inputAssetSlug = getTokenSlug(inputAssets.asset);
  const outputAssetSlug = getTokenSlug(outputAssets.asset);

  return (
    <View style={styles.submitButton}>
      <ButtonLargePrimary disabled={inputAssetSlug === outputAssetSlug} title="Swap" onPress={onSubmit} />
    </View>
  );
};
