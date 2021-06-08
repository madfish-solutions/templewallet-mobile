import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from '../../../styles/format-size';
import { TokenMetadataInterface } from '../../../token/interfaces/token-metadata.interface';
import { isString } from '../../../utils/is-string';
import { Icon } from '../../icon/icon';
import { IconNameEnum } from '../../icon/icon-name.enum';
import { useHeaderTokenInfoStyles } from './header-token-info.styles';

interface Props {
  token: Omit<TokenMetadataInterface, 'id' | 'address'>;
}

export const HeaderTokenInfo: FC<Props> = ({ token }) => {
  const styles = useHeaderTokenInfoStyles();

  const { name, symbol, iconName = IconNameEnum.NoNameToken } = token;
  const title = isString(name) ? name : symbol;

  return (
    <View style={styles.container}>
      <Icon name={iconName} size={formatSize(32)} />
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};
