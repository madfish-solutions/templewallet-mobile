import React, { FC, memo } from 'react';
import { View } from 'react-native';

import { Icon } from 'src/components/icon/icon';
import { formatSize } from 'src/styles/format-size';

import { IconNameEnum } from '../icon/icon-name.enum';
import { useAudioPlaceholderStyles } from './audio-placeholder.styles';

interface AudioPlaceholderProps {
  size?: 'small' | 'large';
}

export const AudioPlaceholder: FC<AudioPlaceholderProps> = memo(({ size = 'small' }) => {
  const styles = useAudioPlaceholderStyles();

  const isSmall = size === 'small';
  const width = formatSize(isSmall ? 32 : 80);
  const height = formatSize(isSmall ? 40 : 100);

  return (
    <View style={[isSmall ? null : styles.absoluteFillObject, styles.card]}>
      <View style={styles.container}>
        <Icon name={IconNameEnum.Audio} width={width} height={height} />
      </View>
    </View>
  );
});
