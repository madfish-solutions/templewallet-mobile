import React, { FC } from 'react';

import { EmptyFn } from '../../../config/general';
import { conditionalStyle } from '../../../utils/conditional-style';
import { Touchable } from '../../touchable/touchable';
import { DropdownItemContainerStyles } from './dropdown-item-container.styles';

interface Props {
  hasMargin?: boolean;
  isSelected?: boolean;
  onPress?: EmptyFn;
}

export const DropdownItemContainer: FC<Props> = ({ hasMargin = false, isSelected = false, onPress, children }) => (
  <Touchable
    style={[
      DropdownItemContainerStyles.root,
      conditionalStyle(hasMargin, DropdownItemContainerStyles.rootMargin),
      conditionalStyle(isSelected, DropdownItemContainerStyles.rootSelected)
    ]}
    onPress={onPress}>
    {children}
  </Touchable>
);
