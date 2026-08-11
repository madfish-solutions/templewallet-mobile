import FastImage from '@d11/react-native-fast-image';
import React, { memo, useMemo } from 'react';

import { AssetIconPlaceholder } from '../asset-icon-placeholder';

import { TokenIconStyles } from './token-icon.styles';

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

    const style = useMemo(
      () => [isShowPlaceholder && TokenIconStyles.hiddenImage, { borderRadius, width: size, height: size }],
      [borderRadius, isShowPlaceholder, size]
    );

    return (
      <>
        {isShowPlaceholder && <AssetIconPlaceholder isCollectible={isCollectible} size={placeholderSize} />}
        {uri != null && <FastImage style={style} source={{ uri }} onError={onError} onLoad={onLoad} />}
      </>
    );
  }
);
