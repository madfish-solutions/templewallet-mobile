import { BigNumber } from 'bignumber.js';
import React, { FC, useState } from 'react';
import { Text, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';

import { Divider } from 'src/components/divider/divider';
import { Label } from 'src/components/label/label';
import { TextSegmentControl } from 'src/components/segmented-control/text-segment-control/text-segment-control';
import { StyledNumericInput } from 'src/components/styled-numberic-input/styled-numeric-input';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { setSlippage } from 'src/store/settings/settings-actions';
import { useSlippageSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics, usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { SwapSettingsSelectors } from './swap-settings.selectors';
import { useSwapSettingsStyles } from './swap-settings.styles';

const FALLBACK_SLIPPAGE_TOLERANCE = new BigNumber(0);

const mapSlippageToIndex = (slippage: number): number => {
  switch (slippage) {
    case 0.25:
      return 0;
    case 0.5:
      return 1;
    case 0.75:
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
  const { trackEvent } = useAnalytics();

  usePageAnalytic(ScreensEnum.SwapSettingsScreen);

  const handleTokenInputTypeChange = (tokenTypeIndex: number) => {
    setInputTypeIndex(tokenTypeIndex);

    switch (tokenTypeIndex) {
      case 0:
        return updateSlippageTolerance(0.25);
      case 1:
        return updateSlippageTolerance(0.5);
      case 2:
        return updateSlippageTolerance(0.75);
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

  const onHandleChange = (value: BigNumber = FALLBACK_SLIPPAGE_TOLERANCE) => {
    updateSlippageTolerance(value.toNumber());
    trackEvent(SwapSettingsSelectors.customInput, AnalyticsEventCategory.FormChange, { value: value.toNumber() });
  };

  return (
    <ScrollView keyboardShouldPersistTaps={'never'} style={styles.contentWrapper}>
      <Label label="Slippage tolerance" />
      <TextSegmentControl
        selectedIndex={inputTypeIndex}
        values={['0.25%', '0.5%', '0.75%', 'Custom']}
        onChange={handleTokenInputTypeChange}
        testID={SwapSettingsSelectors.slippageToleranceToggle}
      />
      <Divider size={formatSize(10)} />
      {inputTypeIndex === 3 && (
        <StyledNumericInput
          value={new BigNumber(slippageTolerance)}
          maxValue={30}
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
