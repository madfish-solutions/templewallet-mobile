import React, { FC } from 'react';
import { ViewStyle } from 'react-native';
import Video from 'react-native-video';

import { emptyFn } from 'src/config/general';

interface SimpleVideoProps {
  uri: string;
  size: number;
  style?: ViewStyle;
  onError?: () => void;
  onLoad?: () => void;
}

export const SimplePlayer: FC<SimpleVideoProps> = ({ uri, size, style, onError = emptyFn, onLoad = emptyFn }) => {
  return (
    <Video
      repeat
      source={{ uri }}
      // @ts-ignore
      style={[{ width: size, height: size }, style]}
      resizeMode="cover"
      onError={onError}
      onLoad={onLoad}
    />
  );
};
