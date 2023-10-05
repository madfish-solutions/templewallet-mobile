import React, { memo } from 'react';

import { SegmentedControl, SegmentedControlProps } from '../segmented-control';
import { TextSegmentControlValue } from './text-segment-control-value/text-segment-control-value';

type Props = Omit<SegmentedControlProps<string>, 'renderValue'>;

export const TextSegmentControl = memo<Props>(props => (
  <SegmentedControl {...props} renderValue={TextSegmentControlValue} />
));
