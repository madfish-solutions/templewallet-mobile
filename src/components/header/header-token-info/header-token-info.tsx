import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from '../../../styles/format-size';
import { TokenMetadataInterface } from '../../../token/interfaces/token-metadata.interface';
import { Icon } from '../../icon/icon';
import { IconNameEnum } from '../../icon/icon-name.enum';
import { useHeaderTokenInfoStyles } from './header-token-info.styles';

interface Props {
  token: Omit<TokenMetadataInterface, 'id' | 'address'>;
}

export const HeaderTokenInfo: FC<Props> = ({ token }) => {
  const styles = useHeaderTokenInfoStyles();

  const { name, iconName = IconNameEnum.NoNameToken } = token;

  return (
    <View style={styles.container}>
      <Icon name={iconName} size={formatSize(32)} />
      <Text style={styles.text}>{name}</Text>
    </View>
  );
};
