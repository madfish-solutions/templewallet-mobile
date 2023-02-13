import React, { FC, useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import FastImage, { Source } from 'react-native-fast-image';
import { SvgCssUri } from 'react-native-svg';

import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { formatSizeScaled } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { TokenMetadataInterface } from 'src/token/interfaces/token-metadata.interface';
import { formatImgUri, isImgUriSvg, isImgUriDataUri } from 'src/utils/image.utils';
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';

import { DataUriImage } from '../data-uri-image';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TokenIconStyles } from './token-icon.styles';

interface Props extends Pick<TokenMetadataInterface, 'iconName' | 'thumbnailUri'> {
  size?: number;
}

export const TokenIcon: FC<Props> = ({ iconName, thumbnailUri, size = formatSizeScaled(32) }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFailed, setIsFailed] = useState(false);

  const colors = useColors();

  const { metadata } = useNetworkInfo();

  const isShowPlaceholder = useMemo(() => isLoading || isFailed, [isLoading, isFailed]);
  const style = useMemo(
    () => [isShowPlaceholder && TokenIconStyles.hiddenImage, { width: size, height: size }],
    [isShowPlaceholder, size]
  );
  const source = useMemo<Source>(
    () => (isString(thumbnailUri) ? { uri: formatImgUri(thumbnailUri) } : {}),
    [thumbnailUri]
  );

  const handleError = useCallback(() => setIsFailed(true), []);
  const handleLoadEnd = useCallback(() => setIsLoading(false), []);

  return (
    <View style={[TokenIconStyles.container, { borderRadius: size / 2 }]}>
      {(() => {
        if (isDefined(iconName)) {
          return <Icon name={iconName} color={metadata.iconName === iconName ? colors.black : undefined} size={size} />;
        }

        if (!isString(thumbnailUri)) {
          return <Icon name={IconNameEnum.NoNameToken} size={size} />;
        }

        if (isImgUriSvg(thumbnailUri)) {
          return <SvgCssUri width={size} height={size} uri={thumbnailUri} />;
        }

        if (isImgUriDataUri(thumbnailUri)) {
          return <DataUriImage width={size} height={size} dataUri={thumbnailUri} />;
        }

        return (
          <>
            {isShowPlaceholder && <Icon name={IconNameEnum.NoNameToken} size={size} />}
            <FastImage style={style} source={source} onError={handleError} onLoadEnd={handleLoadEnd} />
          </>
        );
      })()}
    </View>
  );
};
