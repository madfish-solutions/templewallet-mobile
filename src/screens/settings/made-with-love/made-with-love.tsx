import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React from 'react';
import { Text, View } from 'react-native';

import { website } from '../../../config/socials';
import { openUrl } from '../../../utils/linking.util';
import Heart from './heart.svg';
import { useMadeWithLoveStyles } from './made-with-love.styles';
import MadfishLogo from './madfish-logo.svg';

export const MadeWithLove = () => {
  const styles = useMadeWithLoveStyles();

  return (
    <TouchableOpacity style={styles.container} onPress={() => openUrl(website)}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Made with </Text>
        <Heart />
        <Text style={styles.text}>️ by </Text>
      </View>
      <MadfishLogo />
    </TouchableOpacity>
  );
};
