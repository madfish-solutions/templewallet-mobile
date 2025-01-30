import React, { FC } from 'react';
import FastImage from 'react-native-fast-image';

import { formatSize } from '../../styles/format-size';

import { useAvatarImageStyles } from './avatar-image.styles';

interface Props {
  uri: string;
  size?: number;
  onError?: EmptyFn;
}

export const AvatarImage: FC<Props> = ({ uri, size = formatSize(16), onError }) => {
  const styles = useAvatarImageStyles();

  return (
    <FastImage
      onError={onError}
      style={[styles.icon, { width: size, height: size }]}
      source={{ uri }}
      resizeMode={FastImage.resizeMode.cover}
    />
  );
};
