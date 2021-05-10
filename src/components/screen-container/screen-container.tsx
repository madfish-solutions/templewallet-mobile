import React, { FC } from 'react';
import { ScrollView } from 'react-native';

import { useScreenContainerStyles } from './screen-container.styles';

export const ScreenContainer: FC = ({ children }) => {
  const styles = useScreenContainerStyles();

  return <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>{children}</ScrollView>;
};
