import FastImage from '@d11/react-native-fast-image';
import React, { memo, useMemo } from 'react';

import { useTokenImagesStack } from 'src/hooks/use-images-stack';
import { useDidUpdate } from 'src/utils/hooks';

import { AssetIconPlaceholder } from '../asset-icon-placeholder';

import { TokenIconStyles } from './token-icon.styles';

interface Props {
  borderRadius?: number;
  isCollectible?: boolean;
  useOriginal?: boolean;
  uri: string;
  size: number;
  onError?: EmptyFn;
}

export const LoadableTokenIconImage = memo<Props>(
  ({ borderRadius, isCollectible = false, uri, size, onError, useOriginal = false }) => {
    const { src, isLoading, isStackFailed, onSuccess, onFail } = useTokenImagesStack(uri, useOriginal);

    useDidUpdate(() => {
      if (isStackFailed) {
        onError?.();
      }
    }, [isStackFailed, onError]);

    const isShowPlaceholder = useMemo(() => isLoading || isStackFailed, [isLoading, isStackFailed]);

    const style = useMemo(
      () => [isShowPlaceholder && TokenIconStyles.hiddenImage, { borderRadius, width: size, height: size }],
      [borderRadius, isShowPlaceholder, size]
    );

    return (
      <>
        {isShowPlaceholder && <AssetIconPlaceholder isCollectible={isCollectible} size={size} />}
        <FastImage style={style} source={{ uri: src }} onError={onFail} onLoad={onSuccess} />
      </>
    );
  }
);
