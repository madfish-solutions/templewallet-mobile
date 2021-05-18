import React from 'react';

import { AnimatedIcon } from '../../../icon/animated-icon';
import { IconNameEnum } from '../../../icon/icon-name.enum';
import { SegmentedControlValueComponent } from '../../segmented-control';
import { useSegmentedControlColor } from '../../use-segmented-control-color.hook';

export const IconSegmentControlValue: SegmentedControlValueComponent<IconNameEnum> = ({ item, isSelected }) => {
  const color = useSegmentedControlColor(isSelected);

  return <AnimatedIcon name={item} color={color} />;
};
