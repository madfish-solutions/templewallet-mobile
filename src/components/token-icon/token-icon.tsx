import React, { FC } from 'react';
import { Image, View } from 'react-native';
import { SvgCssUri } from 'react-native-svg';

import { useFormatScaledSize } from '../../styles/format-scaled-size';
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
  const imageSize = useFormatScaledSize(size);

  return (
    <View style={[TokenIconStyles.container, { borderRadius: imageSize / 2 }]}>
      {isDefined(iconName) ? (
        <Icon name={iconName} size={imageSize} />
      ) : isString(thumbnailUri) ? (
        isImgUriSvg(thumbnailUri) ? (
          <SvgCssUri width={imageSize} height={imageSize} uri={thumbnailUri} />
        ) : (
          <Image source={{ uri: formatImgUri(thumbnailUri), width: imageSize, height: imageSize }} />
        )
      ) : (
        <Icon name={IconNameEnum.NoNameToken} size={imageSize} />
      )}
    </View>
  );
};
