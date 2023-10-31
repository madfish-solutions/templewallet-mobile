import React, { FC, memo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { InsetSubstitute } from '../inset-substitute/inset-substitute';
import { useHeaderCardStyles } from './header-card.styles';

interface Props {
  hasInsetTop?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const HeaderCard: FC<Props> = memo(({ hasInsetTop = false, style, children }) => {
  const styles = useHeaderCardStyles();

  return (
    <View style={[styles.container, style]}>
      {hasInsetTop && <InsetSubstitute />}
      {children}
    </View>
  );
});
