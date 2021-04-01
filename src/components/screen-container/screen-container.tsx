import React, { FC } from 'react';
import { Button, ScrollView, View } from 'react-native';

import { InsetSubstitute } from '../inset-substitute/inset-substitute';
import { ScreenContainerStyles } from './screen-container.styles';

export const ScreenContainer: FC = ({ children }) => {
  return (
    <View style={ScreenContainerStyles.root}>
      <View style={ScreenContainerStyles.header}>
        <InsetSubstitute />
        <Button title="Back" onPress={() => void 0} />
      </View>
      <ScrollView
        contentContainerStyle={
          ScreenContainerStyles.scrollViewContentContainer
        }>
        {children}
      </ScrollView>
    </View>
  );
};
