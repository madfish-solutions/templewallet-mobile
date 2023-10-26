import React, { FC } from 'react';
import { View } from 'react-native';

import { Icon } from 'src/components/icon/icon';

import { formatSize } from '../../styles/format-size';
import { IconNameEnum } from '../icon/icon-name.enum';

import { useAudioPlaceholderStyles } from './audio-placeholder.styles';

const themeStyles = {
  small: {
    width: formatSize(32),
    height: formatSize(40)
  },
  big: {
    width: formatSize(80),
    height: formatSize(100)
  }
};

export enum AudioPlaceholderTheme {
  small = 'small',
  big = 'big'
}

interface Props {
  theme?: AudioPlaceholderTheme;
}

export const AudioPlaceholder: FC<Props> = ({ theme = AudioPlaceholderTheme.big }) => {
  const styles = useAudioPlaceholderStyles();

  return (
    <View style={styles.root}>
      <Icon name={IconNameEnum.Audio} width={themeStyles[theme].width} height={themeStyles[theme].height} />
    </View>
  );
};
