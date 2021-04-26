import React, { FC } from 'react';
import { ScrollView } from 'react-native';

import { ScreenContainerStyles } from './screen-container.styles';

export const ScreenContainer: FC = ({ children }) => (
  <ScrollView contentContainerStyle={ScreenContainerStyles.scrollViewContentContainer}>{children}</ScrollView>
);
