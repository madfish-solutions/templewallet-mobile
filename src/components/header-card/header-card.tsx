import React, { FC } from 'react';
import { View, ViewStyle } from 'react-native';

import { InsetSubstitute } from '../inset-substitute/inset-substitute';
import { useHeaderCardStyles } from './header-card.styles';

interface Props {
  hasInsetTop?: boolean;
  style?: ViewStyle;
}

export const HeaderCard: FC<Props> = ({ hasInsetTop = false, children, style }) => {
  const styles = useHeaderCardStyles();

  return (
    <View style={[styles.container, style]}>
      {hasInsetTop && <InsetSubstitute />}
      {children}
    </View>
  );
};
