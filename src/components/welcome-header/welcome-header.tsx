import React from 'react';
import { View } from 'react-native';

import { InsetSubstitute } from '../inset-substitute/inset-substitute';
import { Quote } from '../quote/quote';

export const WelcomeHeader = () => (
  <View>
    <InsetSubstitute />
    <Quote
      quote="The only function of economic forecasting is to make astrology look more respectable."
      author="John Kenneth Galbraith"
    />
  </View>
);
