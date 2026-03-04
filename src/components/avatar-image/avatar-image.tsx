import FastImage from '@d11/react-native-fast-image';
import React, { FC } from 'react';

import { formatSize } from 'src/styles/format-size';

import { useAvatarImageStyles } from './avatar-image.styles';

interface Props {
  uri: string;
  size?: number;
}

export const AvatarImage: FC<Props> = ({ uri, size = formatSize(16) }) => {
  const styles = useAvatarImageStyles();

  return (
    <FastImage
      style={[styles.icon, { width: size, height: size }]}
      source={{ uri }}
      resizeMode={FastImage.resizeMode.cover}
    />
  );
};
