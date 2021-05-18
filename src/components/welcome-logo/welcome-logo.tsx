import React from 'react';
import { Image, View } from 'react-native';

import { useWelcomeLogoStyles } from './welcome-logo.styles';

export const WelcomeLogo = () => {
  const styles = useWelcomeLogoStyles();

  return (
    <View style={styles.imageView}>
      <Image style={styles.image} source={require('../../assets/temple-logo-with-text.png')} />
    </View>
  );
};
