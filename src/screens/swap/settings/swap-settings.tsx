import React, { FC, useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import { Divider } from '../../../components/divider/divider';
import { Label } from '../../../components/label/label';
import { TextSegmentControl } from '../../../components/segmented-control/text-segment-control/text-segment-control';
import { StyledNumericInput } from '../../../components/styled-numberic-input/styled-numeric-input';
import { useSlippageTolerance } from '../../../hooks/slippage-tolerance/use-async-storage.hook';
import { formatSize } from '../../../styles/format-size';
import { useSwapSettingsStyles } from './swap-settings.styles';

export const SwapSettingsScreen: FC = () => {
  const styles = useSwapSettingsStyles();
  const { updateSlippageTolerance } = useSlippageTolerance();
  const [inputTypeIndex, setInputTypeIndex] = useState(1);
  const [slippageTolerance, setSlippageTolerance] = useState('');

  useEffect(() => {
    updateSlippageTolerance("1.5");
  }, []);

  const handleTokenInputTypeChange = (tokenTypeIndex: number) => {
    setInputTypeIndex(tokenTypeIndex);

    switch (tokenTypeIndex) {
      case 0:
        return updateSlippageTolerance("0.75");
      case 1:
        return updateSlippageTolerance("1.5");
      case 2:
        return updateSlippageTolerance("3.0");
      case 3: {
        if (!slippageTolerance) {
          return;
        }
        return updateSlippageTolerance(slippageTolerance);
      }

      default:
        return;
    }
  };

  const onHandleChange = value => {
    setSlippageTolerance(value);
  };

  console.log('slippageTolerance', slippageTolerance);

  return (
    <View style={styles.contentWrapper}>
      <Label label="Slippage tolerance" />
      <TextSegmentControl
        selectedIndex={inputTypeIndex}
        values={['0.75%', '1.5%', '3.0%', 'Custom']}
        onChange={handleTokenInputTypeChange}
      />
      <Divider size={formatSize(10)} />
      {inputTypeIndex === 3 && (
        <StyledNumericInput
          value={slippageTolerance}
          decimals={2}
          editable={true}
          isShowCleanButton
          onBlur={() => console.log('blur')}
          onChange={onHandleChange}
        />
      )}
      <Text style={styles.desctiption}>
        Slippage tolerance is a setting for the limit of price slippage you are willing to accept.
      </Text>
    </View>
  );
};
