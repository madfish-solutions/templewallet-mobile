import React from 'react';

import { website } from 'src/config/socials';
import { openUrl } from 'src/utils/linking';

import { SafeTouchableOpacity } from '../safe-touchable-opacity';

import OctopusLogo from './octopus-logo.svg';
import { OctopusWithLoveStyles } from './octopus-with-love.styles';

export const OctopusWithLove = () => (
  <SafeTouchableOpacity style={OctopusWithLoveStyles.container} onPress={() => openUrl(website)}>
    <OctopusLogo />
  </SafeTouchableOpacity>
);
