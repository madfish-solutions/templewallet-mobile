import React, { FC } from 'react';

import { SegmentedControl, SegmentedControlProps } from '../segmented-control';
import { TextSegmentControlValue } from './text-segment-control-value/text-segment-control-value';

export const TextSegmentControl: FC<SegmentedControlProps<string>> = ({ selectedIndex, values, width, onChange }) => (
  <SegmentedControl
    selectedIndex={selectedIndex}
    values={values}
    renderValue={TextSegmentControlValue}
    width={width}
    onChange={onChange}
  />
);
