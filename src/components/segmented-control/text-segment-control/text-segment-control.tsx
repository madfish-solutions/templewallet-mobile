import React, { FC } from 'react';

import { SegmentedControl, SegmentedControlProps } from '../segmented-control';
import { TextSegmentControlValue } from './text-segment-control-value/text-segment-control-value';

export const TextSegmentControl: FC<SegmentedControlProps<string>> = ({
  disabledValuesIndices,
  selectedIndex,
  values,
  width,
  optionAnalyticsPropertiesFn,
  onChange,
  style,
  testID,
  testIDProperties
}) => (
  <SegmentedControl
    disabledValuesIndices={disabledValuesIndices}
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
