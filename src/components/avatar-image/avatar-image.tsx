import React, { FC } from 'react';
import FastImage from 'react-native-fast-image';

import { formatSize } from '../../styles/format-size';
import { useAvatarImageStyles } from './avatar-image.styles';

interface Props {
  uri: string;
  size?: number;
}

export const AvatarImage: FC<Props> = ({ uri, size = formatSize(16) }) => {
  const styles = useAvatarImageStyles();

  return <FastImage source={{ uri }} style={[styles.icon, { maxWidth: size, maxHeight: size }]} />;
};
