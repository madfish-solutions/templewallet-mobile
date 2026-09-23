import FastImage, { ImageStyle } from '@d11/react-native-fast-image';
import React, { memo, useMemo } from 'react';

import { AssetIconPlaceholder } from '../asset-icon-placeholder';

interface Props {
  borderRadius?: number;
  isCollectible?: boolean;
  isLoading: boolean;
  isStackFailed: boolean;
  onError: EmptyFn;
  onLoad: EmptyFn;
  size: number;
  placeholderSize: number;
  uri?: string;
}

export const LoadableTokenIconImage = memo<Props>(
  ({ borderRadius, isCollectible = false, isLoading, isStackFailed, onError, onLoad, size, placeholderSize, uri }) => {
    const isShowPlaceholder = useMemo(() => isLoading || isStackFailed, [isLoading, isStackFailed]);

    const style = useMemo<ImageStyle>(
      () => ({
        borderRadius,
        height: size,
        left: (placeholderSize - size) / 2,
        position: 'absolute',
        top: (placeholderSize - size) / 2,
        width: size
      }),
      [borderRadius, placeholderSize, size]
    );

    return (
      <>
        {isShowPlaceholder && <AssetIconPlaceholder isCollectible={isCollectible} size={placeholderSize} />}
        {uri != null && <FastImage key={uri} style={style} source={{ uri }} onError={onError} onLoad={onLoad} />}
      </>
    );
  }
);
