import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { website } from 'src/config/socials';
import { openUrl } from 'src/utils/linking';

import OctopusLogo from './octopus-logo.svg';
import { OctopusWithLoveStyles } from './octopus-with-love.styles';

export const OctopusWithLove = () => (
  <TouchableOpacity style={OctopusWithLoveStyles.container} onPress={() => openUrl(website)}>
    <OctopusLogo />
  </TouchableOpacity>
);
