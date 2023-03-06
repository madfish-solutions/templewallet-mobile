import { BigNumber } from 'bignumber.js';
import React, { FC, useState } from 'react';
import { Text, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';

import { Divider } from '../../../components/divider/divider';
import { Label } from '../../../components/label/label';
import { TextSegmentControl } from '../../../components/segmented-control/text-segment-control/text-segment-control';
import { StyledNumericInput } from '../../../components/styled-numberic-input/styled-numeric-input';
import { ScreensEnum } from '../../../navigator/enums/screens.enum';
import { setSlippage } from '../../../store/settings/settings-actions';
import { useSlippageSelector } from '../../../store/settings/settings-selectors';
import { formatSize } from '../../../styles/format-size';
import { usePageAnalytic } from '../../../utils/analytics/use-analytics.hook';
import { isDefined } from '../../../utils/is-defined';
import { SwapSettingsSelectors } from './swap-settings.selectors';
import { useSwapSettingsStyles } from './swap-settings.styles';

const mapSlippageToIndex = (slippage: number): number => {
  switch (slippage) {
    case 0.75:
      return 0;
    case 1.5:
      return 1;
    case 3:
      return 2;
    default:
      return 3;
  }
};

export const SwapSettingsScreen: FC = () => {
  const styles = useSwapSettingsStyles();
  const dispatch = useDispatch();
  const updateSlippageTolerance = (slippage: number) => dispatch(setSlippage(slippage));
  const slippageTolerance = useSlippageSelector();
  const [inputTypeIndex, setInputTypeIndex] = useState(mapSlippageToIndex(slippageTolerance));

  usePageAnalytic(ScreensEnum.SwapSettingsScreen);

  const handleTokenInputTypeChange = (tokenTypeIndex: number) => {
    setInputTypeIndex(tokenTypeIndex);

    switch (tokenTypeIndex) {
      case 0:
        return updateSlippageTolerance(0.75);
      case 1:
        return updateSlippageTolerance(1.5);
      case 2:
        return updateSlippageTolerance(3.0);
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

  const onHandleChange = (value: BigNumber | undefined) => {
    if (isDefined(value)) {
      updateSlippageTolerance(value.toNumber());
    } else {
      updateSlippageTolerance(0);
    }
  };

  return (
    <ScrollView keyboardShouldPersistTaps={'never'} style={styles.contentWrapper}>
      <Label label="Slippage tolerance" />
      <TextSegmentControl
        selectedIndex={inputTypeIndex}
        values={['0.75%', '1.5%', '3.0%', 'Custom']}
        onChange={handleTokenInputTypeChange}
        testID={SwapSettingsSelectors.slippageToleranceToggle}
      />
      <Divider size={formatSize(10)} />
      {inputTypeIndex === 3 && (
        <StyledNumericInput
          value={new BigNumber(slippageTolerance)}
          maxValue={new BigNumber(30)}
          decimals={2}
          editable={true}
          isShowCleanButton
          onChange={onHandleChange}
          testID={SwapSettingsSelectors.customInput}
        />
      )}
      <Text style={styles.desctiption}>
        Slippage tolerance is a setting for the limit of price slippage you are willing to accept (max 30%).
      </Text>
    </ScrollView>
  );
};
