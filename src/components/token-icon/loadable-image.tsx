import React, { FC, useCallback, useMemo, useState } from 'react';
import FastImage, { Source } from 'react-native-fast-image';

import { emptyFn } from 'src/config/general';
import { formatImgUri } from 'src/utils/image.utils';
import { isString } from 'src/utils/is-string';

import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TokenIconStyles } from './token-icon.styles';

interface Props {
  uri: string;
  size: number;
  onError?: () => void;
}

export const LoadableTokenIconImage: FC<Props> = ({ uri, size, onError = emptyFn }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFailed, setIsFailed] = useState(false);

  const isShowPlaceholder = useMemo(() => isLoading || isFailed, [isLoading, isFailed]);

  const style = useMemo(
    () => [isShowPlaceholder && TokenIconStyles.hiddenImage, { width: size, height: size }],
    [isShowPlaceholder, size]
  );

  const source = useMemo<Source>(() => (isString(uri) ? { uri: formatImgUri(uri) } : {}), [uri]);

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
