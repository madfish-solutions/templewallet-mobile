import React, { FC } from 'react';
import { Image, View } from 'react-native';
import { SvgCssUri } from 'react-native-svg';

import { formatSize } from '../../styles/format-size';
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

export const TokenIcon: FC<Props> = ({ token, size = formatSize(32) }) => {
  const { iconName, thumbnailUri } = token;

  return (
    <View style={[TokenIconStyles.container, { borderRadius: size / 2 }]}>
      {isDefined(iconName) ? (
        <Icon name={iconName} size={size} />
      ) : isString(thumbnailUri) ? (
        isImgUriSvg(thumbnailUri) ? (
          <SvgCssUri width={size} height={size} uri={thumbnailUri} />
        ) : (
          <Image source={{ uri: formatImgUri(thumbnailUri), width: size, height: size }} />
        )
      ) : (
        <Icon name={IconNameEnum.NoNameToken} size={size} />
      )}
    </View>
  );
};
