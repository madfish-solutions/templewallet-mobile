import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React from 'react';

import { website } from '../../config/socials';
import { openUrl } from '../../utils/linking';
import OctopusLogo from './octopus-logo.svg';
import { OctopusWithLoveStyles } from './octopus-with-love.styles';

export const OctopusWithLove = () => (
  <TouchableOpacity style={OctopusWithLoveStyles.container} onPress={() => openUrl(website)}>
    <OctopusLogo />
  </TouchableOpacity>
);
