import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';

import { EmptyFn } from '../../../config/general';
import { conditionalStyle } from '../../../utils/conditional-style';
import { DropdownItemContainerStyles } from './dropdown-item-container.styles';

interface Props {
  hasMargin?: boolean;
  isSelected?: boolean;
  onPress?: EmptyFn;
}

export const DropdownItemContainer: FC<Props> = ({ hasMargin = false, isSelected = false, onPress, children }) => (
  <TouchableOpacity
    style={[
      DropdownItemContainerStyles.root,
      conditionalStyle(hasMargin, DropdownItemContainerStyles.rootMargin),
      conditionalStyle(isSelected, DropdownItemContainerStyles.rootSelected)
    ]}
    onPress={onPress}>
    {children}
  </TouchableOpacity>
);
