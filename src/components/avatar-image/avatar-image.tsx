import React, { FC, useState } from 'react';
import { Image } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { useAvatarImageStyles } from './avatar-image.styles';

interface Props {
  uri: string;
  size?: number;
}

export const AvatarImage: FC<Props> = ({ uri, size = formatSize(44) }) => {
  const styles = useAvatarImageStyles();

  return <Image source={{ uri, width: size, height: size }} style={styles.icon} />;
};
