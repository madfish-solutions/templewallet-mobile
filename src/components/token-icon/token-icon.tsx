import React, { FC } from 'react';
import { Image, View } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { formatImgUri } from '../../utils/image.utils';
import { isDefined } from '../../utils/is-defined';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TokenIconStyles } from './token-icon.styles';

interface Props {
  token: TokenMetadataInterface;
}

export const TokenIcon: FC<Props> = ({ token }) => {
  const { iconName, iconUrl } = token;
  const size = formatSize(32);

  return (
    <View style={TokenIconStyles.container}>
      {isDefined(iconName) ? (
        <Icon name={iconName} size={size} />
      ) : isDefined(iconUrl) ? (
        <Image source={{ uri: formatImgUri(iconUrl), width: size, height: size }} />
      ) : (
        <Icon name={IconNameEnum.NoNameToken} size={size} />
      )}
    </View>
  );
};
