import React, { FC } from 'react';
import { Button, ScrollView, View } from 'react-native';

import { InsetSubstitute } from '../inset-substitute/inset-substitute';
import { ScreenContainerStyles } from './screen-container.styles';
import { useNavigation } from '../../navigator/use-navigation.hook';

export const ScreenContainer: FC = ({ children }) => {
  const { goBack } = useNavigation();

  return (
    <View style={ScreenContainerStyles.root}>
      <View style={ScreenContainerStyles.header}>
        <InsetSubstitute />
        <Button title="Back" onPress={goBack} />
      </View>
      <ScrollView contentContainerStyle={ScreenContainerStyles.scrollViewContentContainer}>{children}</ScrollView>
    </View>
  );
};
