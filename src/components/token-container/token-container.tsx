import React, { FC } from 'react';
import { Image, Text, View } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { formatImgUri } from '../../utils/image.utils';
import { isDefined } from '../../utils/is-defined';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { useTokenContainerStyles } from './token-container.styles';

export interface TokenPreviewProps {
  symbol: string;
  name: string;
  iconName?: IconNameEnum;
  iconUrl?: string;
  apy?: number;
}

export const TokenContainer: FC<TokenPreviewProps> = ({
  symbol,
  name,
  iconName,
  iconUrl,
  apy,
  children
}) => {
  const styles = useTokenContainerStyles();
  const size = formatSize(32);

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <View style={styles.iconContainer}>
          {isDefined(iconName) ? (
            <Icon name={iconName} size={size} />
          ) : isDefined(iconUrl) ? (
            <Image source={{ uri: formatImgUri(iconUrl), width: size, height: size }} />
          ) : (
            <Icon name={IconNameEnum.NoNameToken} size={size} />
          )}
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.symbolContainer}>
            <Text style={styles.symbolText}>{symbol}</Text>
            {isDefined(apy) && (
              <View style={styles.apyContainer}>
                <Text style={styles.apyText}>APY: {apy}%</Text>
              </View>
            )}
          </View>
          <Text style={styles.nameText}>{name}</Text>
        </View>
      </View>

      <View style={styles.rightContainer}>{children}</View>
    </View>
  );
};
