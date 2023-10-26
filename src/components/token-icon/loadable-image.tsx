import React, { FC, useCallback, useMemo, useRef, useState } from 'react';
import FastImage, { Source } from 'react-native-fast-image';

import { emptyFn, EmptyFn } from 'src/config/general';
import { formatImgUri, ImageResolutionEnum } from 'src/utils/image.utils';
import { isString } from 'src/utils/is-string';

import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TokenIconStyles } from './token-icon.styles';

interface Props {
  useOriginal?: boolean;
  uri: string;
  size: number;
  onError?: EmptyFn;
}

export const LoadableTokenIconImage: FC<Props> = ({ uri, size, onError = emptyFn, useOriginal = false }) => {
  const lastItemId = useRef(uri);

  const [isLoading, setIsLoading] = useState(true);
  const [isFailed, setIsFailed] = useState(false);
  if (uri !== lastItemId.current) {
    lastItemId.current = uri;
    setIsLoading(true);
    setIsFailed(false);
  }

  const isShowPlaceholder = useMemo(() => isLoading || isFailed, [isLoading, isFailed]);

  const style = useMemo(
    () => [isShowPlaceholder && TokenIconStyles.hiddenImage, { width: size, height: size }],
    [isShowPlaceholder, size]
  );

  const source = useMemo<Source>(
    () => (isString(uri) ? { uri: formatImgUri(uri, ImageResolutionEnum.SMALL, !useOriginal) } : {}),
    [uri, useOriginal]
  );

  const handleError = useCallback(() => {
    setIsFailed(true);
    onError();
  }, [onError]);
  const handleLoadEnd = useCallback(() => setIsLoading(false), []);

  return (
    <>
      {isShowPlaceholder && <Icon name={IconNameEnum.NoNameToken} size={size} />}
      <FastImage style={style} source={source} onError={handleError} onLoadEnd={handleLoadEnd} />
    </>
  );
};
