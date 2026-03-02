import React from 'react';
import { LayoutChangeEvent, StyleProp, View, ViewStyle } from 'react-native';

import { InsetSubstitute } from '../inset-substitute/inset-substitute';

import { useHeaderCardStyles } from './header-card.styles';

interface Props {
  hasInsetTop?: boolean;
  style?: StyleProp<ViewStyle>;
  onLayout?: (event: LayoutChangeEvent) => void;
}

export const HeaderCard: FCWithChildren<Props> = ({ hasInsetTop = false, style, children, onLayout }) => {
  const styles = useHeaderCardStyles();

  return (
    <View style={[styles.container, style]} onLayout={onLayout}>
      {hasInsetTop && <InsetSubstitute />}
      {children}
    </View>
  );
};
