import React, { FC } from 'react';

import { SegmentedControl, SegmentedControlProps } from '../segmented-control';

import { TextSegmentControlValue } from './text-segment-control-value/text-segment-control-value';

export const TextSegmentControl: FC<SegmentedControlProps<string>> = ({
  selectedIndex,
  values,
  width,
  optionAnalyticsPropertiesFn,
  onChange,
  style,
  disabledIndexes,
  testID,
  testIDProperties
}) => (
  <SegmentedControl
    disabledIndexes={disabledIndexes}
    selectedIndex={selectedIndex}
    values={values}
    renderValue={TextSegmentControlValue}
    width={width}
    optionAnalyticsPropertiesFn={optionAnalyticsPropertiesFn}
    onChange={onChange}
    style={style}
    testID={testID}
    testIDProperties={testIDProperties}
  />
);
