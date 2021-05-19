import React, { FC } from 'react';
import { View } from 'react-native';

import { InsetSubstitute } from '../inset-substitute/inset-substitute';
import { useHeaderCardStyles } from './header-card.styles';

interface Props {
  hasInsetTop?: boolean;
}

export const HeaderCard: FC<Props> = ({ hasInsetTop = false, children }) => {
  const styles = useHeaderCardStyles();

  return (
    <View style={styles.container}>
      {hasInsetTop && <InsetSubstitute />}
      {children}
    </View>
  );
};
