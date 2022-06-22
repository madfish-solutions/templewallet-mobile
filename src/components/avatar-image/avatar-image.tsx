import React, { FC, useMemo, useState } from 'react';
import { Image } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { isDefined } from '../../utils/is-defined';
import { useAvatarImageStyles } from './avatar-image.styles';

interface Props {
  uri: string;
  size?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export const AvatarImage: FC<Props> = ({ uri, size = formatSize(16), maxWidth, maxHeight }) => {
  const styles = useAvatarImageStyles();
  const [{ width, height }, setSize] = useState({ width: size, height: size });

  useMemo(
    () =>
      Image.getSize(uri, (width, height) => {
        if ((isDefined(maxWidth) && width <= maxWidth) || width <= formatSize(16)) {
          setSize({ width, height });
        }
      }),
    [uri]
  );

  return <Image source={{ uri }} style={[styles.icon, { maxWidth, maxHeight, width, height }]} />;
};
