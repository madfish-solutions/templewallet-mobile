import React, { memo } from 'react';

import { IconNameEnum } from 'src/components/icon/icon-name.enum';

import { SegmentedControl, SegmentedControlProps } from '../segmented-control';

import { IconSegmentControlValue } from './icon-segment-control-value/icon-segment-control-value';

export const IconSegmentControl = memo<SegmentedControlProps<IconNameEnum>>(
  ({ disabledIndexes, selectedIndex, values, width, onChange }) => (
    <SegmentedControl
      disabledIndexes={disabledIndexes}
      selectedIndex={selectedIndex}
      values={values}
      ValueComponent={IconSegmentControlValue}
      width={width}
      onChange={onChange}
    />
  )
);
