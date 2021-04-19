import React, { FC } from 'react';
import { ScrollView, View } from 'react-native';

import { InsetSubstitute } from '../inset-substitute/inset-substitute';
import { GoBackButton } from './go-back-button/go-back-button';
import { ScreenContainerStyles } from './screen-container.styles';

interface Props {
  hasBackButton?: boolean;
}

export const ScreenContainer: FC<Props> = ({ hasBackButton = true, children }) => (
  <View style={ScreenContainerStyles.root}>
    <View style={ScreenContainerStyles.header}>
      <InsetSubstitute />
      {hasBackButton && <GoBackButton />}
    </View>
    <ScrollView contentContainerStyle={ScreenContainerStyles.scrollViewContentContainer}>{children}</ScrollView>
  </View>
);
