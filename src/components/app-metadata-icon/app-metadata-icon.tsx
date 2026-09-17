import React, { FC, useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { SvgUri } from 'react-native-svg';

import { formatSize } from 'src/styles/format-size';
import { isImgUriSvg } from 'src/utils/image.utils';
import { isString } from 'src/utils/is-string';

import { AvatarImage } from '../avatar-image/avatar-image';
import { useAvatarImageStyles } from '../avatar-image/avatar-image.styles';
import { RobotIcon } from '../robot-icon/robot-icon';

import { AppMetadataIconStyles } from './app-metadata-icon.styles';

interface Props {
  iconUri?: string;
  iconSeed: string;
  size?: number;
  style?: { borderRadius?: number; borderWidth?: number };
}

export const AppMetadataIcon: FC<Props> = ({ iconUri, iconSeed, size = formatSize(16), style }) => {
  const avatarStyles = useAvatarImageStyles();
  const [isFailed, setIsFailed] = useState(false);

  useEffect(() => setIsFailed(false), [iconUri]);

  const handleError = useCallback(() => setIsFailed(true), []);

  const fallback = <RobotIcon seed={iconSeed} size={size} style={style} />;

  if (!isString(iconUri) || isFailed) {
    return fallback;
  }

  if (isImgUriSvg(iconUri)) {
    return (
      <View style={[avatarStyles.icon, AppMetadataIconStyles.svgContainer, { width: size, height: size }, style]}>
        <SvgUri
          uri={iconUri}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          onError={handleError}
          fallback={fallback}
        />
      </View>
    );
  }

  return <AvatarImage uri={iconUri} size={size} style={style} onError={handleError} />;
};
