import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { conditionalStyle } from 'src/utils/conditional-style';

import { useDropdownItemContainerStyles } from './dropdown-item-container.styles';

interface Props {
  hasMargin?: boolean;
  isSelected?: boolean;
  isCompact?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const DropdownItemContainer: FCWithChildren<Props> = ({
  hasMargin = false,
  isSelected = false,
  isCompact = false,
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
        conditionalStyle(isSelected, styles.rootSelected),
        conditionalStyle(isCompact, styles.compactRoot)
      ]}
    >
      {children}
    </View>
  );
};
