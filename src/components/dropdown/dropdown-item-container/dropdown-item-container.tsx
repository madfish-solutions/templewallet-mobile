import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { conditionalStyle } from 'src/utils/conditional-style';

import { useDropdownItemContainerStyles } from './dropdown-item-container.styles';

interface Props {
  hasMargin?: boolean;
  isSelected?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const DropdownItemContainer: FCWithChildren<Props> = ({
  hasMargin = false,
  isSelected = false,
  style,
  children
}) => {
  const styles = useDropdownItemContainerStyles();

  return (
    <View
      style={[
        styles.root,
        style,
        conditionalStyle(hasMargin, styles.rootMargin),
        conditionalStyle(isSelected, styles.rootSelected)
      ]}
    >
      {children}
    </View>
  );
};
