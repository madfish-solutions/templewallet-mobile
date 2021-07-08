import React, { FC } from 'react';
import { View, ViewProps } from 'react-native';

import { conditionalStyle } from '../../../utils/conditional-style';
import { useDropdownItemContainerStyles } from './dropdown-item-container.styles';

interface Props {
  hasMargin?: boolean;
  isSelected?: boolean;
  style?: ViewProps['style'];
}

export const DropdownItemContainer: FC<Props> = ({ hasMargin = false, isSelected = false, children, style }) => {
  const styles = useDropdownItemContainerStyles();

  return (
    <View
      style={[
        styles.root,
        conditionalStyle(hasMargin, styles.rootMargin),
        conditionalStyle(isSelected, styles.rootSelected),
        style
      ]}>
      {children}
    </View>
  );
};
