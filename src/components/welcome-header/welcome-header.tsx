import React from 'react';
import { Text, View } from 'react-native';

import { InsetSubstitute } from '../inset-substitute/inset-substitute';
import { useWelcomeHeaderStyles } from './welcome-header.styles';

export const WelcomeHeader = () => {
  const styles = useWelcomeHeaderStyles();

  return (
    <View>
      <InsetSubstitute />
      <Text style={styles.headerTitle}>
        <Text style={styles.headerTitleQuotes}>“</Text>The only function of economic forecasting is to make astrology
        look more respectable.
        <Text style={styles.headerTitleQuotes}>”</Text>
      </Text>
      <Text style={styles.headerSecondTitle}>John Kenneth Galbraith</Text>
    </View>
  );
};
