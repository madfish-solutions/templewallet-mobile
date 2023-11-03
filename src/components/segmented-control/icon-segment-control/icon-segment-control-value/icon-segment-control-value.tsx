import React, { memo } from 'react';

import { AnimatedIcon } from '../../../icon/animated-icon';
import { IconNameEnum } from '../../../icon/icon-name.enum';
import { SegmentedControlValueComponentProps } from '../../segmented-control';
import { useSegmentedControlColor } from '../../use-segmented-control-color.hook';

export const IconSegmentControlValue = memo<SegmentedControlValueComponentProps<IconNameEnum>>(
  ({ item, isSelected, isDisabled }) => {
    const color = useSegmentedControlColor(isSelected, isDisabled);

    return <AnimatedIcon name={item} color={color} />;
  }
);
