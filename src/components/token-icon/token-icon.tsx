import React, { FC, useCallback, useMemo, useState } from 'react';
import { Image, ImageSourcePropType, View } from 'react-native';
import { SvgCssUri } from 'react-native-svg';

import { formatSizeScaled } from '../../styles/format-size';
import { TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { formatImgUri, isImgUriSvg } from '../../utils/image.utils';
import { isDefined } from '../../utils/is-defined';
import { isString } from '../../utils/is-string';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TokenIconStyles } from './token-icon.styles';

interface Props extends Pick<TokenMetadataInterface, 'iconName' | 'thumbnailUri'> {
  size?: number;
}

export const TokenIcon: FC<Props> = ({ iconName, thumbnailUri, size = formatSizeScaled(32) }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFailed, setIsFailed] = useState(false);

  const isShowPlaceholder = useMemo(() => isLoading || isFailed, [isLoading, isFailed]);
  const style = useMemo(() => [isShowPlaceholder && TokenIconStyles.hiddenImage], [isShowPlaceholder]);
  const source = useMemo<ImageSourcePropType>(
    () => (isString(thumbnailUri) ? { uri: formatImgUri(thumbnailUri), width: size, height: size } : {}),
    [thumbnailUri, size]
  );

  const handleError = useCallback(() => setIsFailed(true), []);
  const handleLoadEnd = useCallback(() => setIsLoading(false), []);

  return (
    <View style={[TokenIconStyles.container, { borderRadius: size / 2 }]}>
      {isDefined(iconName) ? (
        <Icon name={iconName} size={size} />
      ) : isString(thumbnailUri) ? (
        isImgUriSvg(thumbnailUri) ? (
          <SvgCssUri width={size} height={size} uri={thumbnailUri} />
        ) : (
          <>
            {isShowPlaceholder && <Icon name={IconNameEnum.NoNameToken} size={size} />}
            <Image style={style} source={source} onError={handleError} onLoadEnd={handleLoadEnd} />
          </>
        )
      ) : (
        <Icon name={IconNameEnum.NoNameToken} size={size} />
      )}
    </View>
  );
};
