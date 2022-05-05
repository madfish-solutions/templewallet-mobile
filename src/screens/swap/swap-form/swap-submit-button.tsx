import { useFormikContext } from 'formik';
import React, { FC } from 'react';
import { View } from 'react-native';

import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { SwapFormValues } from '../../../interfaces/swap-asset.interface';
import { getTokenSlug } from '../../../token/utils/token.utils';
import { useSwapStyles } from '../swap.styles';

export const SwapSubmitButton: FC = () => {
  const styles = useSwapStyles();

  const { values, submitForm } = useFormikContext<SwapFormValues>();
  const { inputAssets, outputAssets } = values;

  const inputAssetSlug = getTokenSlug(inputAssets.asset);
  const outputAssetSlug = getTokenSlug(outputAssets.asset);

  return (
    <View style={styles.submitButton}>
      <ButtonLargePrimary disabled={inputAssetSlug === outputAssetSlug} title="Swap" onPress={submitForm} />
    </View>
  );
};
