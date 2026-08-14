import React from 'react';
import { TouchableOpacity } from 'react-native';

import { website } from 'src/config/socials';
import { formatSize } from 'src/styles/format-size';
import { openUrl } from 'src/utils/linking';

import OctopusLogo from './octopus-logo.svg';
import { OctopusWithLoveStyles } from './octopus-with-love.styles';

export const OctopusWithLove = () => (
  <TouchableOpacity style={OctopusWithLoveStyles.container} onPress={() => openUrl(website)}>
    <OctopusLogo height={formatSize(40)} />
  </TouchableOpacity>
);
