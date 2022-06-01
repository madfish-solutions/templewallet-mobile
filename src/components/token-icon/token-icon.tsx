import React, { FC, useState } from 'react';
import { Image, View } from 'react-native';
import { SvgCssUri } from 'react-native-svg';

import { formatSizeScaled } from '../../styles/format-size';
import { TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { formatImgUri, isImgUriSvg } from '../../utils/image.utils';
import { isDefined } from '../../utils/is-defined';
import { isString } from '../../utils/is-string';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TokenIconStyles } from './token-icon.styles';

interface Props {
  token: TokenMetadataInterface;
  size?: number;
}

export const TokenIcon: FC<Props> = ({ token, size = formatSizeScaled(32) }) => {
  const { iconName, thumbnailUri } = token;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <View style={[TokenIconStyles.container, { borderRadius: size / 2 }]}>
      {isDefined(iconName) ? (
        <Icon name={iconName} size={size} />
      ) : isString(thumbnailUri) ? (
        isImgUriSvg(thumbnailUri) ? (
          <SvgCssUri width={size} height={size} uri={thumbnailUri} />
        ) : (
          <>
            {isLoading && <Icon name={IconNameEnum.NoNameToken} size={size} />}
            <Image
              style={[isLoading && TokenIconStyles.hidden]}
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
              source={{ uri: formatImgUri(thumbnailUri), width: size, height: size }}
            />
          </>
        )
      ) : (
        <Icon name={IconNameEnum.NoNameToken} size={size} />
      )}
    </View>
  );
};
