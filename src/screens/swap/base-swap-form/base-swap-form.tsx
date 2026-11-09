import React, { ReactNode } from 'react';
import { View } from 'react-native';

import { AssetAmountInterface } from 'src/components/asset-amount-input/asset-amount-input';
import { AssetAmountInputProps } from 'src/components/asset-amount-input/asset-amount-input.props';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { Divider } from 'src/components/divider/divider';
import { InterfaceDisclaimer } from 'src/components/interface-disclaimer/interface-disclaimer';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormAssetAmountInput } from 'src/form/form-asset-amount-input/form-asset-amount-input';
import { AssetInterface } from 'src/interfaces/asset.interface';
import { formatSize } from 'src/styles/format-size';

import { SwapInputAssetAmountInput, SwapOutputAssetAmountInput } from '../components/swap-asset-amount-input';
import { SwapDirectionButton } from '../components/swap-direction-button';
import { SwapFormSelectors } from '../swap-form/swap-form.selectors';
import { useSwapFormStyles } from '../swap-form/swap-form.styles';

interface Props<TAsset extends AssetInterface> {
  inputTokens: TAsset[];
  outputTokens: TAsset[];
  outputValue: AssetAmountInterface<TAsset>;
  isLoading: boolean;
  onInputChange: (value: AssetAmountInterface<TAsset>) => boolean | void;
  onOutputChange: (value: AssetAmountInterface<TAsset>) => boolean | void;
  onReverse: EmptyFn;
  reverseDisabled?: boolean;
  inputProps?: Pick<AssetAmountInputProps<TAsset>, 'maxAmount' | 'maxButtonDisabled'>;
  banner?: ReactNode;
  exchangeRate: ReactNode;
  swapParamsAreLoading: boolean;
  submitDisabled: boolean;
  onSubmit: EmptyFn;
}

export const BaseSwapForm = <TAsset extends AssetInterface>({
  inputTokens,
  outputTokens,
  outputValue,
  isLoading,
  onInputChange,
  onOutputChange,
  onReverse,
  reverseDisabled,
  inputProps,
  banner,
  exchangeRate,
  swapParamsAreLoading,
  submitDisabled,
  onSubmit
}: Props<TAsset>) => {
  const styles = useSwapFormStyles();
  const fromProps = {
    ...inputProps,
    label: 'From',
    maxButton: true,
    assetsList: inputTokens,
    isLoading,
    onValueChange: onInputChange,
    testID: SwapFormSelectors.fromAssetAmountInput,
    tokenTestID: SwapFormSelectors.fromTokenChange
  };
  const toProps = {
    value: outputValue,
    label: 'To',
    toUsdToggle: false,
    editable: false,
    stylesConfig: { amountInput: styles.outputAmountInput, inputContainer: styles.outputInputContainer },
    assetsList: outputTokens,
    isLoading,
    onValueChange: onOutputChange,
    testID: SwapFormSelectors.toAssetAmountInput,
    tokenTestID: SwapFormSelectors.toTokenChange
  };

  return (
    <>
      <ScreenContainer>
        <Divider size={formatSize(8)} />
        <FormAssetAmountInput {...fromProps} name="inputAssets" inputComponent={SwapInputAssetAmountInput} />
        <SwapDirectionButton
          onPress={onReverse}
          disabled={reverseDisabled}
          testID={SwapFormSelectors.swapAssetsButton}
        />
        <FormAssetAmountInput {...toProps} name="outputAssets" inputComponent={SwapOutputAssetAmountInput} />
        {banner}
        <View>{exchangeRate}</View>
        <View style={styles.disclaimerContainer}>
          <InterfaceDisclaimer linkText="3route DEX aggregator" url="https://3route.io/" />
        </View>
      </ScreenContainer>
      <ButtonsFloatingContainer style={styles.buttonContainer}>
        <ButtonLargePrimary
          disabled={submitDisabled || swapParamsAreLoading}
          title="Swap"
          isLoading={swapParamsAreLoading}
          onPress={onSubmit}
          testID={SwapFormSelectors.swapButton}
        />
      </ButtonsFloatingContainer>
    </>
  );
};
