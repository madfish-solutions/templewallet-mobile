import React, { memo } from 'react';

import { SegmentedControl, SegmentedControlProps } from '../segmented-control';
import { TextSegmentControlValue } from './text-segment-control-value/text-segment-control-value';

export const TextSegmentControl = memo<SegmentedControlProps<string>>(props => (
  <SegmentedControl {...props} ValueComponent={TextSegmentControlValue} />
));
