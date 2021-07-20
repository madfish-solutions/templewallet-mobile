import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { AssetMetadataInterface } from '../../../token/interfaces/token-metadata.interface';
import { isString } from '../../../utils/is-string';
import { TokenIcon } from '../../token-icon/token-icon';
import { useHeaderTokenInfoStyles } from './header-token-info.styles';

interface Props {
  token: AssetMetadataInterface;
}

export const HeaderTokenInfo: FC<Props> = ({ token }) => {
  const styles = useHeaderTokenInfoStyles();

  const { name, symbol } = token;
  const title = isString(name) ? name : symbol;

  return (
    <View style={styles.container}>
      <TokenIcon token={token} />
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};
