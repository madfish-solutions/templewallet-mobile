import React, { FC, memo } from 'react';
import { View } from 'react-native';

import { Icon } from 'src/components/icon/icon';
import { formatSize } from 'src/styles/format-size';

import { IconNameEnum } from '../icon/icon-name.enum';
import { useAudioPlaceholderStyles } from './audio-placeholder.styles';

const width = formatSize(80);
const height = formatSize(100);

export const AudioPlaceholder: FC = memo(() => {
  const styles = useAudioPlaceholderStyles();

  return (
    <View style={styles.card}>
      <View style={styles.container}>
        <Icon name={IconNameEnum.Audio} width={width} height={height} />
      </View>
    </View>
  );
});
