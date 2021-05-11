import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';

import { EmptyFn } from '../../../config/general';
import { conditionalStyle } from '../../../utils/conditional-style';
import { useDropdownItemContainerStyles } from './dropdown-item-container.styles';

interface Props {
  hasMargin?: boolean;
  isSelected?: boolean;
  onPress?: EmptyFn;
}

export const DropdownItemContainer: FC<Props> = ({ hasMargin = false, isSelected = false, onPress, children }) => {
  const styles = useDropdownItemContainerStyles();

  return (
    <TouchableOpacity
      style={[
        styles.root,
        conditionalStyle(hasMargin, styles.rootMargin),
        conditionalStyle(isSelected, styles.rootSelected)
      ]}
      onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};
