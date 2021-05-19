import React from 'react';
import { Image } from 'react-native';

import { useWelcomeLogoStyles } from './welcome-logo.styles';

export const WelcomeLogo = () => {
  const styles = useWelcomeLogoStyles();

  return <Image style={styles.image} source={require('../../assets/temple-logo-with-text.png')} />;
};
