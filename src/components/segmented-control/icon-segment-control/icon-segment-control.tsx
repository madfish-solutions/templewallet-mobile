import React, { FC } from 'react';

import { IconNameEnum } from '../../icon/icon-name.enum';
import { SegmentedControl, SegmentedControlProps } from '../segmented-control';
import { IconSegmentControlValue } from './icon-segment-control-value/icon-segment-control-value';

export const IconSegmentControl: FC<SegmentedControlProps<IconNameEnum>> = ({
  selectedIndex,
  values,
  width,
  onChange
}) => (
  <SegmentedControl
    selectedIndex={selectedIndex}
    values={values}
    renderValue={IconSegmentControlValue}
    width={width}
    onChange={onChange}
  />
);
