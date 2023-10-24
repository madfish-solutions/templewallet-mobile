import React, { FC } from 'react';
import { View } from 'react-native';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { formatSize } from 'src/styles/format-size';

import { useAudioPlaceholderStyles } from './styles';

interface Props {
  large?: boolean;
}

export const AudioPlaceholder: FC<Props> = ({ large = true }) => {
  const styles = useAudioPlaceholderStyles();

  const width = large ? formatSize(80) : formatSize(32);
  const height = large ? formatSize(100) : formatSize(40);

  return (
    <View style={styles.root}>
      <Icon name={IconNameEnum.Audio} width={width} height={height} />
    </View>
  );
};
