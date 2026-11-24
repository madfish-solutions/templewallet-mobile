import React, { FC } from 'react';
import FastImage, { FastImageProps } from 'react-native-fast-image';

import { formatSize } from 'src/styles/format-size';

import { useAvatarImageStyles } from './avatar-image.styles';

interface Props {
  uri: string;
  size?: number;
  style?: FastImageProps['style'];
  onError?: FastImageProps['onError'];
}

export const AvatarImage: FC<Props> = ({ uri, size = formatSize(16), style, onError }) => {
  const styles = useAvatarImageStyles();

  return (
    <FastImage
      style={[styles.icon, { width: size, height: size }, style]}
      source={{ uri }}
      objectFit="cover"
      onError={onError}
    />
  );
};
