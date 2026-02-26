import React, { memo, useMemo } from 'react';
import FastImage from 'react-native-fast-image';

import { useTokenImageStack } from 'src/hooks/use-images-stack';
import { useDidUpdate } from 'src/utils/hooks';

import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';

import { TokenIconStyles } from './token-icon.styles';

interface Props {
  useOriginal?: boolean;
  uri: string;
  size: number;
  onError?: EmptyFn;
}

export const LoadableTokenIconImage = memo<Props>(({ uri, size, onError, useOriginal = false }) => {
  const { src, isLoading, isStackFailed, onSuccess, onFail } = useTokenImageStack(uri, useOriginal);

  useDidUpdate(() => {
    if (isStackFailed) {
      onError?.();
    }
  }, [isStackFailed, onError]);

  const isShowPlaceholder = useMemo(() => isLoading || isStackFailed, [isLoading, isStackFailed]);

  const style = useMemo(
    () => [isShowPlaceholder && TokenIconStyles.hiddenImage, { width: size, height: size }],
    [isShowPlaceholder, size]
  );

  return (
    <>
      {isShowPlaceholder && <Icon name={IconNameEnum.NoNameToken} size={size} />}
      <FastImage style={style} source={{ uri: src }} onError={onFail} onLoad={onSuccess} />
    </>
  );
});
